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

// සූත්‍රයේ පාඨ කොටස් සංඥා ඛාණ්ඩයේ ආකෘතියට බෙදීම:
//   තේරුම (සූත්‍රයේ සන්නය) → වෘත්තිය (පාළි) → වෘත්තියේ සන්නය → විශේෂ විවරණ (ඉතිරි සියල්ල)
function kkSplitSannaLayout(blocks) {
    const bl = (blocks || []).slice();
    let meaning = null;
    if (bl.length && bl[0].kind === 'sanna' && bl[1] && bl[1].kind === 'pali') meaning = bl.shift();
    const vutti = [];
    while (bl.length && bl[0].kind === 'pali') vutti.push(bl.shift());
    const vsanna = [];
    if (vutti.length) while (bl.length && bl[0].kind === 'sanna') vsanna.push(bl.shift());
    return { meaning, vutti, vsanna, rest: bl };
}

function renderKarakaWorkspace(s, targetContainerId = 'viewSuttaPanel') {
    const box = document.getElementById(targetContainerId);
    if (!box || !s) return;
    window.AppState.currentSutta = s;

    const { meaning, vutti, vsanna, rest } = kkSplitSannaLayout(s.blocks);
    const lead = s.lead || [];
    const inner = list => list.map(b => b.html).join('');
    const refs = [s.kac ? `කච්. ${s.kac}` : '', s.rs ? `රූ.සි. ${s.rs}` : ''].filter(Boolean).join(' · ');

    box.innerHTML = `
        ${s.is_intro ? kkContents() : ''}

        <!-- 01. සූත්‍ර Top Banner (සංඥා ඛාණ්ඩයේ ආකෘතිය) -->
        <div class="panel-card sanna-banner-card">
            <div class="tag-row" style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap;">
                <span class="sanna-category-badge">${s.is_intro ? 'හැඳින්වීම' : (s.role || 'කාරක සූත්‍ර')}</span>
                <span class="badge badge-khanda">කාරකකණ්ඩ</span>
                ${!s.is_intro && s.sub_khanda_name ? `<span class="badge" style="background:#FAF2E6; color:#6B1D2F; border:1px solid #E6D0BA;">${s.sub_khanda_name}</span>` : ''}
                ${refs ? `<span class="badge" style="background:#FFF; color:#6E6153; border:1px solid #E6D0BA;">${refs}</span>` : ''}
            </div>

            <h2 class="sanna-sutta-title">${s.is_intro ? s.sutta_name : `${s.sutta_number}. ${s.pali}`}</h2>
            ${(s.head_notes || []).length ? `<div class="kk-headnote">${s.head_notes.join('')}</div>` : ''}

            ${meaning ? `
                <div class="sanna-meaning-box">
                    <span class="vutti-label">සූත්‍රයේ තේරුම:</span>
                    <div class="sanna-meaning-text kk-html">${meaning.html}</div>
                </div>
            ` : ''}

            ${(lead.length || vutti.length || vsanna.length) ? `
                <div class="sanna-vutti-box">
                    ${(lead.length || vutti.length) ? `
                        <span class="vutti-label">සූත්‍ර වෘත්තිය (පාළි):</span>
                        <div class="sanna-vutti-text kk-html">
                            ${lead.length ? `<div class="kk-lead-line">${inner(lead)}</div>` : ''}
                            ${inner(vutti)}
                        </div>
                    ` : ''}
                    ${vutti.length && vsanna.length ? `<hr class="sanna-sanna-divider">` : ''}
                    ${vsanna.length ? `
                        <span class="vutti-label">වෘත්තියේ පදයෙන් පද සන්නය:</span>
                        <div class="sanna-vutti-sanna-box">
                            <div class="sanna-sanna-text kk-html">${inner(vsanna)}</div>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
        </div>

        <!-- 02. සන්න, ටීකා හා න්‍යාස විශේෂ විවරණ -->
        ${rest.length ? `
            <div class="panel-card">
                <h3 class="section-heading"><span class="heading-icon">📖</span> සන්න, ටීකා හා න්‍යාස විශේෂ විවරණ</h3>
                <div class="sanna-commentary-box kk-text">${rest.map(kkBlockHtml).join('')}</div>
            </div>
        ` : ''}

        <!-- 03. පාද සටහන් -->
        ${s.footnotes ? `
            <div class="panel-card">
                <details class="kk-foot kk-foot-card"><summary><span class="heading-icon">📝</span> පාද සටහන්</summary>${s.footnotes}</details>
            </div>
        ` : ''}

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
