/**
 * ==========================================================================
 * කාරකකණ්ඩ — කියවීමේ වැඩබිම (js/karaka-view.js)
 * පද සාධන නැත. එක් එක් සූත්‍රය:
 *   • කාරක-විභක්ති සිතියමක් මත ස්ථානගත කරයි (කුමන කාරකය, කුමන විභක්තිය)
 *   • පාළි වුත්තිය හා සිංහල සන්නය ඡේද වශයෙන් යුගල කොට පෙන්වයි
 *   • කියවීමේ මාදිලි තුනක් — සියල්ල / පාළි පමණි / සන්නය පමණි
 *   • උදාහරණ පද උද්දීපනය, ගාථා, වගු, පාද සටහන්, පෙර/ඊළඟ සංචාලනය
 * ==========================================================================
 */

const KK_VIB = [
    { key: 'pathama', pali: 'පඨමා', si: 'ප්‍රථමා', q: 'කො?', color: '#6B7280' },
    { key: 'dutiya', pali: 'දුතියා', si: 'ද්විතීයා', q: 'කිං?', color: '#B45309' },
    { key: 'tatiya', pali: 'තතියා', si: 'තෘතීයා', q: 'කෙන?', color: '#0F766E' },
    { key: 'catutthi', pali: 'චතුත්ථී', si: 'චතුර්ථී', q: 'කස්ස?', color: '#7C3AED' },
    { key: 'pancami', pali: 'පඤ්චමී', si: 'පඤ්චමී', q: 'කස්මා?', color: '#BE123C' },
    { key: 'chatthi', pali: 'ඡට්ඨී', si: 'ෂෂ්ඨී', q: 'කස්ස?', color: '#1D4ED8' },
    { key: 'sattami', pali: 'සත්තමී', si: 'සප්තමී', q: 'කස්මිං?', color: '#15803D' }
];

const KK_KARAKA = {
    lingattha: { pali: 'ලිඞ්ගත්ථ', si: 'ලිංගාර්ථය', vib: 'pathama', icon: '◉', hint: 'ශබ්දාර්ථය කීම පමණි' },
    kattu: { pali: 'කත්තු', si: 'කර්තෘ', vib: 'tatiya', icon: '🧑', hint: 'ක්‍රියාව කරන්නා' },
    hetu: { pali: 'හෙතු', si: 'හේතු කර්තෘ', vib: 'tatiya', icon: '👉', hint: 'කරවන්නා / හේතුව' },
    kamma: { pali: 'කම්ම', si: 'කර්මය', vib: 'dutiya', icon: '🎯', hint: 'ක්‍රියාවට ලක්වන්නේ' },
    karana: { pali: 'කරණ', si: 'කරණය', vib: 'tatiya', icon: '🔧', hint: 'ක්‍රියාවට උපකරණය' },
    sampadana: { pali: 'සම්පදාන', si: 'සම්ප්‍රදානය', vib: 'catutthi', icon: '🎁', hint: 'ලබන්නා' },
    apadana: { pali: 'අපාදාන', si: 'අපාදානය', vib: 'pancami', icon: '↩', hint: 'ඉවත් වන අවධිය' },
    sami: { pali: 'සාමි', si: 'ස්වාමි සම්බන්ධය', vib: 'chatthi', icon: '🔗', hint: 'අයිතිය / සම්බන්ධය' },
    okasa: { pali: 'ඔකාස', si: 'ආධාරය', vib: 'sattami', icon: '📍', hint: 'ක්‍රියාවේ පිහිට' },
    atthantara: { pali: 'අත්ථන්තර', si: 'වෙනත් අර්ථයක්', vib: '', icon: '✳', hint: 'කාරකයෙන් බාහිර අර්ථ' }
};

// ක්‍රියාව වටා කාරක (285 සූත්‍රයේ ‘කො පචති’ උදාහරණය ඇසුරෙන්)
const KK_QUESTION_FLOW = [
    { q: 'කො පචති?', a: 'සූදො', karaka: 'kattu', note: 'උක්ත කර්තෘ' },
    { q: 'කිං පචති?', a: 'ඔදනං', karaka: 'kamma', note: 'කර්මය' },
    { q: 'කෙන පචති?', a: 'අග්ගිනා', karaka: 'karana', note: 'කරණය' },
    { q: 'කෙන පචීයතෙ?', a: 'සූදෙන', karaka: 'kattu', note: 'අනුක්ත කර්තෘ' },
    { q: 'කස්ස දෙති?', a: 'යාචකස්ස', karaka: 'sampadana', note: 'සම්ප්‍රදානය' },
    { q: 'කස්මා අපෙති?', a: 'වනම්හා', karaka: 'apadana', note: 'අවධිය' },
    { q: 'කස්මිං වසති?', a: 'ගාමෙ', karaka: 'okasa', note: 'ආධාරය' }
];

const KK_MODE_KEY = 'rupasiddhi-karaka-mode';
function kkGetMode() {
    try { return localStorage.getItem(KK_MODE_KEY) || 'both'; } catch (e) { return 'both'; }
}
function kkSetMode(m) {
    try { localStorage.setItem(KK_MODE_KEY, m); } catch (e) { /* නොසලකන්න */ }
}

function isKarakaSubKhanda(subId) {
    const k = (typeof KHANDAS_CONFIG !== 'undefined') && KHANDAS_CONFIG.find(x => x.key === '3_karaka');
    return !!(k && k.subCategories.some(s => s.id === subId));
}

// සියලු කාරක සූත්‍ර පිළිවෙළින් (පෙර/ඊළඟ සඳහා)
function kkAllSuttas() {
    const k = KHANDAS_CONFIG.find(x => x.key === '3_karaka');
    const out = [];
    (k ? k.subCategories : []).forEach(sub => {
        ((window.SuttaDatabase || {})[sub.id] || []).forEach(s => out.push({ sub: sub.id, s }));
    });
    return out;
}

function kkVib(key) { return KK_VIB.find(v => v.key === key); }

function kkSuttaChip(num, sub, extraClass = '') {
    const all = kkAllSuttas();
    const hit = all.find(o => o.s.sutta_number === num);
    if (!hit) return '';
    const title = (hit.s.pali || '').replace(/'/g, '&#39;');
    return `<button type="button" class="kk-chip ${extraClass}" title="${title}" onclick="selectSuttaItem(${num}, '${hit.sub}')">${num}</button>`;
}

// ---- 1. කාරක-විභක්ති සිතියම (සූත්‍ර පිටුවේ කුඩා අනුවාදය) ----
function kkMiniMap(s) {
    const vibs = [s.vib].concat(s.vib_extra || []).filter(Boolean);
    const kar = KK_KARAKA[s.karaka] || KK_KARAKA.atthantara;
    const roleText = s.role === 'සංඥා සූත්‍රය'
        ? `<strong>${kar.pali}</strong> (${kar.si}) කාරකය නිර්වචනය කරයි`
        : s.role === 'ආදේශ විධි'
            ? `<strong>${vibs.map(v => kkVib(v).pali).join(', ')}</strong> විභක්තියෙහි රූප ආදේශයකි`
            : `<strong>${kar.pali}</strong> → <strong>${vibs.map(v => kkVib(v).pali).join(' / ')}</strong> විභක්තිය`;
    return `
        <div class="kk-map">
            <div class="kk-map-row">
                ${KK_VIB.map(v => {
                    const on = vibs.includes(v.key);
                    return `<span class="kk-vib-dot ${on ? 'on' : ''}" style="--vc:${v.color}" title="${v.si} විභක්තිය">${v.pali}</span>`;
                }).join('<span class="kk-map-sep"></span>')}
            </div>
            <div class="kk-map-row kk-karaka-row">
                ${Object.entries(KK_KARAKA).map(([k, v]) => `
                    <span class="kk-kar ${k === s.karaka ? 'on' : ''}" title="${v.hint}">${v.icon} ${v.pali}</span>
                `).join('')}
            </div>
            <p class="kk-map-caption">මෙම සූත්‍රය: ${roleText}</p>
        </div>
    `;
}

// ---- 2. පාඨ කොටස් — පාළි ඡේදය + එයට අයත් සන්නය එක් ඒකකයකට ----
function kkUnits(blocks) {
    const units = [];
    let cur = null;
    blocks.forEach(b => {
        if (b.kind === 'pali') {
            cur = { pali: [b], rest: [] };
            units.push(cur);
        } else if (cur && b.kind !== 'anuvutti' && b.kind !== 'subhead') {
            cur.rest.push(b);
        } else {
            units.push({ pali: [], rest: [b] });
            cur = (b.kind === 'subhead') ? null : cur;
        }
    });
    return units;
}

function kkBlockHtml(b) {
    switch (b.kind) {
        case 'pali':
            return `<div class="kk-pali ${b.example ? 'is-example' : ''}">${b.example ? '<span class="kk-tag kk-tag-ex">උදාහරණ</span>' : ''}${b.html}</div>`;
        case 'sanna':
            return `<div class="kk-sanna">${b.html}</div>`;
        case 'verse':
            return `<div class="kk-verse"><span class="kk-tag">ගාථාව</span>${b.html}</div>`;
        case 'list':
            return `<div class="kk-list">${b.html}</div>`;
        case 'table':
            return `<div class="kk-table table-responsive">${b.html}</div>`;
        case 'subhead':
            return `<div class="kk-subhead">${b.html.replace(/\*{3,}/g, '')}</div>`;
        case 'anuvutti':
            return `<div class="kk-anuvutti"><span class="kk-anu-icon">↪</span>${b.html}</div>`;
        default:
            return `<div class="kk-sanna">${b.html}</div>`;
    }
}

function kkRenderUnits(blocks) {
    return kkUnits(blocks).map(u => {
        if (!u.pali.length) return u.rest.map(kkBlockHtml).join('');
        return `
            <div class="kk-unit">
                ${u.pali.map(kkBlockHtml).join('')}
                ${u.rest.length ? `<div class="kk-unit-sanna">${u.rest.map(kkBlockHtml).join('')}</div>` : ''}
            </div>`;
    }).join('');
}

function kkModeBar() {
    const mode = kkGetMode();
    const btn = (m, label) => `<button type="button" class="kk-mode-btn ${mode === m ? 'active' : ''}" aria-pressed="${mode === m}" onclick="kkSwitchMode('${m}')">${label}</button>`;
    return `
        <div class="kk-modebar" role="group" aria-label="කියවීමේ මාදිලිය">
            <span class="kk-modebar-label">කියවන්න:</span>
            ${btn('both', 'පාළි + සන්නය')}
            ${btn('pali', 'පාළි පමණි')}
            ${btn('sanna', 'සන්නය පමණි')}
            <label class="kk-mark-toggle"><input type="checkbox" id="kkMarkToggle" ${kkMarksOn() ? 'checked' : ''} onchange="kkToggleMarks(this.checked)"> ලේඛනයේ උද්දීපන (highlight) පෙන්වන්න</label>
        </div>`;
}

function kkMarksOn() {
    try { return localStorage.getItem('rupasiddhi-karaka-marks') !== '0'; } catch (e) { return true; }
}
function kkToggleMarks(on) {
    try { localStorage.setItem('rupasiddhi-karaka-marks', on ? '1' : '0'); } catch (e) { /* නොසලකන්න */ }
    const r = document.getElementById('kkReader');
    if (r) r.classList.toggle('kk-nomarks', !on);
}
function kkSwitchMode(m) {
    kkSetMode(m);
    const r = document.getElementById('kkReader');
    if (r) r.dataset.mode = m;
    document.querySelectorAll('.kk-mode-btn').forEach(b => {
        const on = b.getAttribute('onclick').includes(`'${m}'`);
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', on);
    });
}

function kkPrevNext(s) {
    const all = kkAllSuttas();
    const i = all.findIndex(o => o.s === s);
    const prev = all[i - 1], next = all[i + 1];
    const link = (o, dir) => o ? `
        <button type="button" class="kk-nav-btn kk-nav-${dir}" onclick="selectSuttaItem(${JSON.stringify(o.s.sutta_number)}, '${o.sub}'); document.getElementById('mainViewport').scrollTo && window.scrollTo({top:0,behavior:'smooth'});">
            <span class="kk-nav-dir">${dir === 'prev' ? '← පෙර' : 'ඊළඟ →'}</span>
            <span class="kk-nav-title">${o.s.is_intro ? o.s.sutta_name : o.s.sutta_number + '. ' + (o.s.pali || '')}</span>
        </button>` : '<span></span>';
    return `<div class="kk-nav">${link(prev, 'prev')}${link(next, 'next')}</div>`;
}

// ---- 3. සූත්‍ර පිටුව ----
function renderKarakaWorkspace(s, targetContainerId = 'viewSuttaPanel') {
    const box = document.getElementById(targetContainerId);
    if (!box || !s) return;
    window.AppState.currentSutta = s;
    if (s.is_intro) return renderKarakaIntro(s, box);

    const v = kkVib(s.vib) || kkVib((KK_KARAKA[s.karaka] || {}).vib) || KK_VIB[0];
    const mode = kkGetMode();

    box.innerHTML = `
        <div class="panel-card kk-hero" style="--vc:${v.color}">
            <div class="kk-hero-top">
                <span class="kk-num">${s.sutta_number}</span>
                <div class="kk-hero-chips">
                    <span class="kk-badge kk-badge-role">${s.role}</span>
                    ${s.kac ? `<span class="kk-badge">කච්. ${s.kac}</span>` : ''}
                    ${s.rs ? `<span class="kk-badge">රූ.සි. ${s.rs}</span>` : ''}
                    <span class="kk-badge kk-badge-sub">${s.sub_khanda_name}</span>
                </div>
            </div>
            <h2 class="kk-sutta">${s.pali}</h2>
            <p class="kk-gist"><span class="kk-gist-label">සාරය</span>${s.gist}</p>
            ${s.gloss ? `<p class="kk-gloss">${s.gloss}</p>` : ''}
            ${(s.head_notes || []).length ? `<div class="kk-headnote">${s.head_notes.join('')}</div>` : ''}
            ${kkMiniMap(s)}
        </div>

        <div class="panel-card kk-reader-card">
            <h3 class="section-heading"><span class="heading-icon">📖</span> වුත්තිය හා සන්නය</h3>
            ${kkModeBar()}
            <div id="kkReader" class="kk-reader ${kkMarksOn() ? '' : 'kk-nomarks'}" data-mode="${mode}">
                ${(s.lead || []).length ? `
                    <div class="kk-lead">
                        <span class="kk-lead-label">පෙර සූත්‍රයෙන් — ප්‍රශ්නය / අනුවෘත්තිය</span>
                        ${s.lead.map(kkBlockHtml).join('')}
                    </div>` : ''}
                ${kkRenderUnits(s.blocks || [])}
            </div>
        </div>

        ${s.footnotes ? `
            <details class="panel-card kk-foot">
                <summary><span class="heading-icon">📝</span> පාද සටහන්</summary>
                ${s.footnotes}
            </details>` : ''}

        ${kkPrevNext(s)}
    `;
}

// ---- 4. හැඳින්වීම: කාරක-විභක්ති සිතියම (සම්පූර්ණ) ----
function renderKarakaIntro(s, box) {
    const all = kkAllSuttas().filter(o => !o.s.is_intro);
    const byVib = {};
    KK_VIB.forEach(v => byVib[v.key] = { sanna: [], vidhi: [], other: [] });
    all.forEach(({ s: x }) => {
        const vibs = [x.vib].concat(x.vib_extra || []).filter(Boolean);
        const kv = vibs.length ? vibs : [(KK_KARAKA[x.karaka] || {}).vib].filter(Boolean);
        kv.forEach(vk => {
            const slot = byVib[vk];
            if (!slot) return;
            if (x.role === 'සංඥා සූත්‍රය') slot.sanna.push(x);
            else if (x.karaka === 'atthantara' || (KK_KARAKA[x.karaka] || {}).vib !== vk) slot.other.push(x);
            else slot.vidhi.push(x);
        });
    });
    const chips = list => list.length ? list.map(x => kkSuttaChip(x.sutta_number)).join('') : '<span class="kk-none">—</span>';
    const mainKar = vk => Object.entries(KK_KARAKA).filter(([, v]) => v.vib === vk).map(([, v]) => `${v.icon} ${v.pali}`).join(' · ');

    box.innerHTML = `
        <div class="panel-card kk-hero kk-intro-hero" style="--vc:#4A2C6B">
            <div class="kk-hero-top"><span class="kk-num">☸</span>
                <div class="kk-hero-chips"><span class="kk-badge kk-badge-role">3. කාරකකණ්ඩ</span><span class="kk-badge">සූත්‍ර 283 – 329</span></div>
            </div>
            <h2 class="kk-sutta">අථ විභත්තීනමත්ථභෙදා වුච්චන්තෙ.</h2>
            <p class="kk-gist"><span class="kk-gist-label">සාරය</span>නාම පදයක අර්ථය ක්‍රියාව හා සම්බන්ධ වන ආකාරය (කාරකය) අනුව විභක්තිය තෝරා ගැනේ. කාරක හයක් ද, ස්වාමි සම්බන්ධය ද, විභක්ති සතක් ද මෙහි විග්‍රහ වේ.</p>
        </div>

        <div class="panel-card">
            <h3 class="section-heading"><span class="heading-icon">🔥</span> ක්‍රියාව වටා කාරක — ‘පචති’ (උයයි)</h3>
            <p class="kk-help">ක්‍රියාවෙන් ප්‍රශ්න කිරීමෙන් කාරකය හඳුනාගත හැකිය (285 සූත්‍රයේ නිදසුන).</p>
            <div class="kk-flow">
                ${KK_QUESTION_FLOW.map(f => {
                    const k = KK_KARAKA[f.karaka]; const v = kkVib(k.vib);
                    return `<div class="kk-flow-card" style="--vc:${v.color}">
                        <span class="kk-flow-q">${f.q}</span>
                        <span class="kk-flow-a">${f.a}</span>
                        <span class="kk-flow-k">${k.icon} ${k.pali} · ${f.note}</span>
                        <span class="kk-flow-v">${v.pali}</span>
                    </div>`;
                }).join('')}
            </div>
        </div>

        <div class="panel-card">
            <h3 class="section-heading"><span class="heading-icon">🗺️</span> කාරක — විභක්ති සිතියම</h3>
            <p class="kk-help">අංකයක් ක්ලික් කර එම සූත්‍රයට යන්න. <strong>සංඥා</strong> = කාරකය නිර්වචනය; <strong>ප්‍රධාන විධි</strong> = කාරකයට විභක්තිය; <strong>අර්ථාන්තර</strong> = වෙනත් අර්ථවලදී එම විභක්තිය.</p>
            <div class="table-responsive">
                <table class="data-table kk-matrix">
                    <thead><tr><th>විභක්තිය</th><th>ප්‍රධාන කාරකය</th><th>සංඥා</th><th>ප්‍රධාන විධි</th><th>අර්ථාන්තර</th></tr></thead>
                    <tbody>
                        ${KK_VIB.map(v => `
                            <tr style="--vc:${v.color}">
                                <td><span class="kk-vib-dot on" style="--vc:${v.color}">${v.pali}</span><small class="kk-vib-si">${v.si} · ${v.q}</small></td>
                                <td>${mainKar(v.key)}</td>
                                <td>${chips(byVib[v.key].sanna)}</td>
                                <td>${chips(byVib[v.key].vidhi)}</td>
                                <td>${chips(byVib[v.key].other)}</td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="panel-card kk-reader-card">
            <h3 class="section-heading"><span class="heading-icon">📖</span> හැඳින්වීම — වුත්තිය හා සන්නය</h3>
            ${kkModeBar()}
            <div id="kkReader" class="kk-reader ${kkMarksOn() ? '' : 'kk-nomarks'}" data-mode="${kkGetMode()}">
                ${kkRenderUnits(s.blocks || [])}
            </div>
        </div>
        ${s.footnotes ? `<details class="panel-card kk-foot"><summary><span class="heading-icon">📝</span> පාද සටහන්</summary>${s.footnotes}</details>` : ''}
        ${kkPrevNext(s)}
    `;
}
