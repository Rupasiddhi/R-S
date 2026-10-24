/**
 * ==========================================================================
 * කාරකකණ්ඩ — සරල කියවීමේ දර්ශනය (js/karaka-view.js)
 * ලේඛනයේ කරුණු එලෙසම, එම පිළිවෙළින්ම, පොතක පිටුවක් සේ පෙන්වයි.
 *   • පාළි පාඨ — තද අකුරින්, වම් පස රේඛාවක් සහිතව
 *   • සිංහල සන්නය — සාමාන්‍ය අකුරින්
 *   • ගාථා, වගු, ලැයිස්තු, පාද සටහන් — ලේඛනයේ ලෙසම
 * පද සාධන නැත; අමතර විග්‍රහ නැත.
 * ==========================================================================
 */

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

function kkBlockHtml(b) {
    switch (b.kind) {
        case 'pali': return `<div class="kk-pali">${b.html}</div>`;
        case 'verse': return `<div class="kk-verse">${b.html}</div>`;
        case 'list': return `<div class="kk-list">${b.html}</div>`;
        case 'table': return `<div class="kk-table table-responsive">${b.html}</div>`;
        case 'subhead': return `<div class="kk-subhead">${b.html.replace(/\*{3,}/g, '')}</div>`;
        case 'anuvutti': return `<div class="kk-pali kk-anu">${b.html}</div>`;
        default: return `<div class="kk-sanna">${b.html}</div>`;
    }
}

function kkGo(num, sub) {
    selectSuttaItem(num, sub);
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
}

function kkPrevNext(s) {
    const all = kkAllSuttas();
    const i = all.findIndex(o => o.s === s);
    const btn = (o, label) => o
        ? `<button type="button" class="kk-nav-btn" onclick="kkGo(${JSON.stringify(o.s.sutta_number)}, '${o.sub}')">${label}<span>${o.s.is_intro ? o.s.sutta_name : o.s.sutta_number + '. ' + (o.s.pali || '')}</span></button>`
        : '<span></span>';
    return `<div class="kk-nav">${btn(all[i - 1], '← පෙර')}${btn(all[i + 1], 'ඊළඟ →')}</div>`;
}

function renderKarakaWorkspace(s, targetContainerId = 'viewSuttaPanel') {
    const box = document.getElementById(targetContainerId);
    if (!box || !s) return;
    window.AppState.currentSutta = s;

    const meta = s.is_intro ? '' : [
        s.role,
        s.kac ? `කච්. ${s.kac}` : '',
        s.rs ? `රූ.සි. ${s.rs}` : '',
        s.sub_khanda_name
    ].filter(Boolean).map(t => `<span class="kk-meta">${t}</span>`).join('');

    const toc = s.is_intro ? kkContents() : '';

    box.innerHTML = `
        ${toc}
        <article class="panel-card kk-page">
            ${(s.lead || []).length ? `<div class="kk-lead">${s.lead.map(kkBlockHtml).join('')}</div>` : ''}
            <header class="kk-head">
                <h2 class="kk-title">${s.is_intro ? s.sutta_name : `<span class="kk-no">${s.sutta_number}.</span> ${s.pali}`}</h2>
                ${meta ? `<div class="kk-metas">${meta}</div>` : ''}
                ${(s.head_notes || []).length ? `<div class="kk-headnote">${s.head_notes.join('')}</div>` : ''}
            </header>
            <div class="kk-text">
                ${(s.blocks || []).map(kkBlockHtml).join('')}
            </div>
            ${s.footnotes ? `<details class="kk-foot"><summary>පාද සටහන්</summary>${s.footnotes}</details>` : ''}
        </article>
        ${kkPrevNext(s)}
    `;
}

// හැඳින්වීම් පිටුවේ — සූත්‍ර පටුන
function kkContents() {
    const k = KHANDAS_CONFIG.find(x => x.key === '3_karaka');
    const groups = (k ? k.subCategories : []).filter(g => !g.id.startsWith('00_'));
    return `
        <section class="panel-card kk-toc">
            <h3 class="kk-toc-title">සූත්‍ර පටුන</h3>
            ${groups.map(g => `
                <div class="kk-toc-group">
                    <h4>${g.name}</h4>
                    <ul>
                        ${((window.SuttaDatabase || {})[g.id] || []).map(x =>
                            `<li><a href="javascript:void(0)" onclick="kkGo(${x.sutta_number}, '${g.id}')"><b>${x.sutta_number}.</b> ${x.pali}</a></li>`
                        ).join('')}
                    </ul>
                </div>`).join('')}
        </section>`;
}
