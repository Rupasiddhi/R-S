// ==========================================================================
// ෂඩාකාර විමර්ශනය - ක්ලික් කළ විට පෙන්වන අන්තර්ක්‍රියාකාරී පුවරුව
//  • ආකාර 6 ක් කුඩා කාඩ්පත් ලෙස පෙනේ (සම්බන්ධො, පදං, පදත්ථො, පදවිග්ගහො, චොදනා, පරිහාරො)
//  • කාඩ්පතක් ක්ලික් කළ විට පමණක් එහි පාළි පාඨය හා සන්නය පහළින් විවෘත වේ
//  • නැවත ක්ලික් කළ විට වැසේ; "පෙර / ඊළඟ" බොත්තම් වලින් ආකාර අතර ගමන් කළ හැක
//  • "සියල්ල" බොත්තමෙන් ආකාර 6ම එකවර බැලිය හැක
// ==========================================================================
(function () {
    const MODES = [
        { key: 'sambandha',   pali: 'sambandha_pali',   name: 'සම්බන්ධො',   hint: 'පෙර පසු සූත්‍ර බැඳීම' },
        { key: 'pada',        pali: 'pada_pali',        name: 'පදං',         hint: 'පද වෙන් කිරීම' },
        { key: 'padattha',    pali: 'padattha_pali',    name: 'පදත්ථො',     hint: 'පදවල අර්ථය' },
        { key: 'padaviggaha', pali: 'padaviggaha_pali', name: 'පදවිග්ගහො', hint: 'සමාසාදී විග්‍රහය' },
        { key: 'chodana',     pali: 'chodana_pali',     name: 'චොදනා',       hint: 'ප්‍රශ්නය' },
        { key: 'parihara',    pali: 'parihara_pali',    name: 'පරිහාරො',     hint: 'පිළිතුර' }
    ];

    const store = {};
    let counter = 0;

    function available(data) {
        return MODES.map((m, i) => ({ m, i, meaning: data[m.key], pali: data[m.pali] }))
            .filter(x => x.meaning || x.pali);
    }

    function detailBlock(x, total, pos, withNav, id) {
        const num = x.i + 1;
        return `
            <div class="shx-detail">
                <div class="shx-detail-head">
                    <span class="shx-num">${num}</span>
                    <h4 class="shx-detail-title">${x.m.name}</h4>
                    <span class="shx-detail-hint">${x.m.hint}</span>
                </div>
                ${x.pali ? `<blockquote class="shx-pali">${x.pali}</blockquote>` : ''}
                <div class="shx-meaning">${x.meaning || '--'}</div>
                ${withNav ? `
                <div class="shx-nav">
                    <button type="button" class="shx-nav-btn" ${pos === 0 ? 'disabled' : ''} onclick="shxStep(${id}, -1)">‹ පෙර ආකාරය</button>
                    <span class="shx-nav-pos">${pos + 1} / ${total}</span>
                    <button type="button" class="shx-nav-btn" ${pos === total - 1 ? 'disabled' : ''} onclick="shxStep(${id}, 1)">ඊළඟ ආකාරය ›</button>
                </div>` : ''}
            </div>`;
    }

    window.renderShadakaraExplorer = function (data) {
        if (!data) return '';
        const items = available(data);
        if (!items.length) return '';
        const id = ++counter;
        store[id] = { items, active: -1, all: false, seen: {} };
        const have = {};
        items.forEach(x => { have[x.i] = true; });

        const tiles = MODES.map((m, i) => has(have, i) ? `
            <button type="button" class="shx-tile" data-i="${i}" aria-expanded="false" aria-controls="shx-${id}-panel"
                    onclick="shxSelect(${id}, ${i})">
                <span class="shx-num">${i + 1}</span>
                <span class="shx-name">${m.name}</span>
                <span class="shx-hint">${m.hint}</span>
            </button>` : `
            <span class="shx-tile shx-tile-empty" aria-hidden="true">
                <span class="shx-num">${i + 1}</span>
                <span class="shx-name">${m.name}</span>
                <span class="shx-hint">—</span>
            </span>`).join('');

        return `
            <div class="shx" id="shx-${id}">
                <p class="shx-intro">
                    <span class="shx-intro-icon">👆</span>
                    සූත්‍රය ආකාර <strong>6</strong>කින් විමසන ආකාරය බැලීමට පහත කාඩ්පතක් ක්ලික් කරන්න.
                </p>
                <div class="shx-tiles">${tiles}</div>
                <div class="shx-panel" id="shx-${id}-panel" aria-live="polite" hidden></div>
                <div class="shx-tools">
                    <button type="button" class="shx-all" id="shx-${id}-all" onclick="shxToggleAll(${id})">ආකාර සියල්ල එකවර පෙන්වන්න</button>
                </div>
            </div>`;
    };

    function has(map, i) { return !!map[i]; }

    function paint(id) {
        const st = store[id];
        const root = document.getElementById('shx-' + id);
        if (!st || !root) return;
        const panel = document.getElementById('shx-' + id + '-panel');
        const allBtn = document.getElementById('shx-' + id + '-all');

        root.querySelectorAll('.shx-tile[data-i]').forEach(btn => {
            const i = Number(btn.dataset.i);
            const on = !st.all && st.active === i;
            btn.classList.toggle('active', on);
            btn.classList.toggle('seen', !!st.seen[i] && !on);
            btn.setAttribute('aria-expanded', on ? 'true' : 'false');
        });

        if (st.all) {
            panel.innerHTML = '<div class="shx-all-list">' +
                st.items.map((x, p) => detailBlock(x, st.items.length, p, false, id)).join('') + '</div>';
            panel.hidden = false;
        } else if (st.active >= 0) {
            const pos = st.items.findIndex(x => x.i === st.active);
            panel.innerHTML = detailBlock(st.items[pos], st.items.length, pos, true, id);
            panel.hidden = false;
        } else {
            panel.innerHTML = '';
            panel.hidden = true;
        }
        if (allBtn) allBtn.textContent = st.all ? 'ආකාර සියල්ල වසන්න' : 'ආකාර සියල්ල එකවර පෙන්වන්න';
        // නැවත ඇඹරුණු විට සජීවීකරණය (animation) ක්‍රියාත්මක වීමට
        panel.classList.remove('shx-pop');
        void panel.offsetWidth;
        panel.classList.add('shx-pop');
    }

    window.shxSelect = function (id, i) {
        const st = store[id];
        if (!st) return;
        st.all = false;
        st.active = (st.active === i) ? -1 : i;
        if (st.active >= 0) st.seen[i] = true;
        paint(id);
    };

    window.shxStep = function (id, dir) {
        const st = store[id];
        if (!st || st.active < 0) return;
        const pos = st.items.findIndex(x => x.i === st.active) + dir;
        if (pos < 0 || pos >= st.items.length) return;
        st.active = st.items[pos].i;
        st.seen[st.active] = true;
        paint(id);
    };

    window.shxToggleAll = function (id) {
        const st = store[id];
        if (!st) return;
        st.all = !st.all;
        if (st.all) st.items.forEach(x => { st.seen[x.i] = true; });
        paint(id);
    };
})();
