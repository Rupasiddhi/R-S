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

// ලේඛනයේ පාඨ කොටස් සංඥා ඛාණ්ඩයේ ආකෘතියට බෙදීම:
//   තේරුම (සූත්‍රයේ සන්නය) → [පාළි පාඨය → එහි පදයෙන් පද සන්නය] × n (ලේඛනයේ පිළිවෙළින්ම)
const KK_PALI_KINDS = ['pali', 'anuvutti', 'verse'];
function kkSplitSannaLayout(blocks) {
    const bl = (blocks || []).slice();
    // පළමු පාළි පාඨයට පෙර ඇති සන්න ඡේද සියල්ල = සූත්‍රයේ තේරුම
    let meaning = null;
    const lead = [];
    while (bl.length && bl[0].kind === 'sanna') lead.push(bl.shift());
    if (lead.length && bl.length) meaning = { kind: 'sanna', html: lead.map(b => b.html).join('') };
    else bl.unshift(...lead);
    const groups = [];
    let g = null;
    bl.forEach(b => {
        if (b.kind === 'subhead') { groups.push({ head: b }); g = null; return; }
        const isPali = KK_PALI_KINDS.includes(b.kind);
        if (!g || (isPali && g.sanna.length)) { g = { pali: [], sanna: [] }; groups.push(g); }
        (isPali ? g.pali : g.sanna).push(b);
    });
    return { meaning, groups };
}

function kkNoteHtml(b) {
    if (b.kind === 'table' || b.kind === 'list') return kkBlockHtml(b);
    return `<div class="kk-note-line">${b.html}</div>`;
}

function kkPairBox(g, first, lead) {
    const notes = g.pali.concat(g.sanna).filter(b => b.note);
    const P = g.pali.filter(b => !b.note), S = g.sanna.filter(b => !b.note);
    const pali = (lead || []).map(b => `<div class="kk-lead-line">${b.html}</div>`).join('') +
        P.map(b => b.kind === 'verse' ? `<div class="kk-verse">${b.html}</div>`
            : b.kind === 'anuvutti' ? `<div class="kk-anu-line">${b.html}</div>` : b.html).join('');
    const sanna = S.map(b => (b.kind === 'sanna' ? b.html : kkBlockHtml(b))).join('');
    const note = notes.length ? `
            <div class="kk-notes">
                <span class="kk-notes-label">📝 විශේෂ සටහන්:</span>
                ${notes.map(kkNoteHtml).join('')}
            </div>` : '';
    if (!pali && !sanna) return note ? `<div class="kk-notes-solo">${note}</div>` : '';
    return `
        <div class="sanna-vutti-box kk-pair">
            ${pali ? `
                <span class="vutti-label">${first ? 'සූත්‍ර වෘත්තිය (පාළි):' : 'පාළි පාඨය:'}</span>
                <div class="sanna-vutti-text kk-html">${pali}</div>
            ` : ''}
            ${pali && sanna ? `<hr class="sanna-sanna-divider">` : ''}
            ${sanna ? `
                <span class="vutti-label">${first ? 'වෘත්තියේ පදයෙන් පද සන්නය:' : 'පදයෙන් පද සන්නය:'}</span>
                <div class="sanna-sanna-text kk-html kk-pair-sanna">${sanna}</div>
            ` : ''}
            ${note}
        </div>`;
}

function renderKarakaWorkspace(s, targetContainerId = 'viewSuttaPanel') {
    const box = document.getElementById(targetContainerId);
    if (!box || !s) return;
    window.AppState.currentSutta = s;

    const { meaning, groups } = kkSplitSannaLayout(s.blocks);
    const refs = [s.kac ? `කච්. ${s.kac}` : '', s.rs ? `රූ.සි. ${s.rs}` : ''].filter(Boolean).join(' · ');
    // ලේඛනයේ පිළිවෙළින්: මූල පාඨ + සන්නය දිස්වේ; ටීකා කොටස් (tika) ක්ලික් කළ පසු පමණි.
    let firstDone = false;
    const items = [];
    groups.forEach(g => {
        if (g.head) { items.push({ html: `<div class="kk-subhead">${g.head.html.replace(/\*{3,}/g, '')}</div>` }); return; }
        const vis = { pali: g.pali.filter(b => !b.tika), sanna: g.sanna.filter(b => !b.tika) };
        const tk = { pali: g.pali.filter(b => b.tika), sanna: g.sanna.filter(b => b.tika) };
        const real = vis.pali.concat(vis.sanna).some(b => !b.note);
        if (real) {
            items.push({ html: kkPairBox(vis, !firstDone && !s.is_intro, firstDone ? null : s.lead), first: !firstDone });
            firstDone = true;
        } else if (vis.pali.length || vis.sanna.length) {
            items.push({ html: kkPairBox(vis, false, null) });
        }
        if (tk.pali.length || tk.sanna.length) items.push({ tika: kkPairBox(tk, false, null) });
    });
    // ෂඩාකාරය පළමු (වෘත්තිය + පදයෙන් පද සන්නය) කොටුවට පසුව; ඉතිරිය ඊට පසු
    let bodyHead = '', body = '';
    const firstIdx = items.findIndex(it => it.first);
    for (let i = 0; i <= firstIdx; i++) bodyHead += items[i].tika ? '' : items[i].html;
    const preTika = items.slice(0, Math.max(firstIdx, 0)).filter(it => it.tika);
    for (let i = firstIdx + 1; i < items.length; i++) {
        if (!items[i].tika) { body += items[i].html; continue; }
        let inner = '';
        while (i < items.length && items[i].tika) inner += items[i++].tika;
        i--;
        body += `<details class="kk-tika"><summary><span class="kk-tika-icon">📜</span> ටීකා විවරණ <span class="kk-tika-hint">(බැලීමට ක්ලික් කරන්න)</span></summary><div class="kk-tika-body">${inner}</div></details>`;
    }
    if (preTika.length) body = `<details class="kk-tika"><summary><span class="kk-tika-icon">📜</span> ටීකා විවරණ <span class="kk-tika-hint">(බැලීමට ක්ලික් කරන්න)</span></summary><div class="kk-tika-body">${preTika.map(it => it.tika).join('')}</div></details>` + body;
    const leadOnly = !firstDone && (s.lead || []).length ? kkPairBox({ pali: [], sanna: [] }, true, s.lead) : '';

    box.innerHTML = `
        <!-- 01. සූත්‍රය, තේරුම, වෘත්තිය හා සන්නය (සංඥා ඛාණ්ඩයේ ආකෘතිය) -->
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

            ${leadOnly}${bodyHead}
        </div>

        <!-- 02. සූත්‍ර ෂඩාකාර විමර්ශනය -->
        ${s.shadakara && typeof renderSannaShadakaraCards === 'function' ? `
            <div class="panel-card">
                <h3 class="section-heading"><span class="heading-icon">⚜️</span> සූත්‍ර ෂඩාකාර විමර්ශනය</h3>
                <div class="shadakara-dynamic-grid">${renderSannaShadakaraCards(s.shadakara)}</div>
            </div>
        ` : ''}

        <!-- 02b. ලේඛනයේ ඉතිරි පාළි පාඨ හා සන්නය -->
        ${body ? `<div class="panel-card sanna-banner-card kk-rest-card">${body}</div>` : ''}


        <!-- 03. පාද සටහන් -->
        ${s.footnotes ? `
            <div class="panel-card">
                <details class="kk-foot kk-foot-card"><summary><span class="heading-icon">📝</span> පාද සටහන්</summary>${s.footnotes}</details>
            </div>
        ` : ''}

        ${kkPrevNext(s)}
    `;
}
