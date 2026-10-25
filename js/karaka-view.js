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

// කාරකකණ්ඩ — මූල පාළි ඡේද වශයෙන් (paras). එක් එක් ඡේදය:
//   පාළි ඡේදය → එහි පදයෙන් පද සන්නය → විශේෂ සටහන් → ටීකා විවරණ (ක්ලික් කළ පසු)
function kkNoteHtml(b) {
    if (b.kind === 'table' || b.kind === 'list') return kkBlockHtml(b);
    if (b.kind === 'subhead') return `<div class="kk-note-head">${b.html.replace(/\*{3,}/g, '')}</div>`;
    return `<div class="kk-note-line">${b.html}</div>`;
}

function kkTikaHtml(list) {
    if (!list || !list.length) return '';
    const pali = list.filter(b => ['pali', 'verse', 'anuvutti'].includes(b.kind)).map(b => b.html).join('');
    const sanna = list.filter(b => !['pali', 'verse', 'anuvutti'].includes(b.kind)).map(b => b.kind === 'sanna' ? b.html : kkBlockHtml(b)).join('');
    return `<details class="kk-tika"><summary><span class="kk-tika-icon">📜</span> ටීකා විවරණ <span class="kk-tika-hint">(බැලීමට ක්ලික් කරන්න)</span></summary>
        <div class="kk-tika-body"><div class="sanna-vutti-box kk-pair">
            ${pali ? `<span class="vutti-label">ටීකා පාඨය:</span><div class="sanna-vutti-text kk-html">${pali}</div>` : ''}
            ${pali && sanna ? `<hr class="sanna-sanna-divider">` : ''}
            ${sanna ? `<span class="vutti-label">පදයෙන් පද සන්නය:</span><div class="sanna-sanna-text kk-html kk-pair-sanna">${sanna}</div>` : ''}
        </div></div></details>`;
}

function kkParaBox(p, first) {
    const sanna = (p.sanna || []).map(b => (b.kind === 'sanna' ? b.html : kkBlockHtml(b))).join('');
    const notes = p.notes || [];
    return `
        ${(p.heads || []).map(h => `<div class="kk-subhead">${h.html.replace(/\*{3,}/g, '')}</div>`).join('')}
        <div class="sanna-vutti-box kk-pair">
            <span class="vutti-label">${first ? 'සූත්‍ර වෘත්තිය (පාළි):' : 'පාළි පාඨය:'}</span>
            <div class="sanna-vutti-text kk-html${p.kind === 'verse' ? ' kk-para-verse' : ''}">${p.html}</div>
            ${sanna ? `
                <hr class="sanna-sanna-divider">
                <span class="vutti-label">${first ? 'වෘත්තියේ පදයෙන් පද සන්නය:' : 'පදයෙන් පද සන්නය:'}</span>
                <div class="sanna-sanna-text kk-html kk-pair-sanna">${sanna}</div>
            ` : ''}
            ${notes.length ? `
                <div class="kk-notes">
                    <span class="kk-notes-label">📝 විශේෂ සටහන්:</span>
                    ${notes.map(kkNoteHtml).join('')}
                </div>` : ''}
        </div>
        ${kkTikaHtml(p.tika)}`;
}

function renderKarakaWorkspace(s, targetContainerId = 'viewSuttaPanel') {
    const box = document.getElementById(targetContainerId);
    if (!box || !s) return;
    window.AppState.currentSutta = s;

    const refs = [s.kac ? `කච්. ${s.kac}` : '', s.rs ? `රූ.සි. ${s.rs}` : ''].filter(Boolean).join(' · ');
    const paras = s.paras || [];
    const meaning = s.meaning ? { html: s.meaning } : null;
    // ෂඩාකාරය පළමු ඡේදයට (වෘත්තිය + පදයෙන් පද සන්නය) පසුව
    const bodyHead = paras.length ? kkParaBox(paras[0], !s.is_intro) : '';
    const body = paras.slice(1).map(p => kkParaBox(p, false)).join('');
    const leadOnly = '';

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

        <!-- 02a. සූත්‍රයට අදාළ විශේෂ සටහන් -->
        ${kkSuttaNotes(s)}

        <!-- 02b. ලේඛනයේ ඉතිරි පාළි පාඨ හා සන්නය -->
        ${body ? `<div class="panel-card sanna-banner-card kk-rest-card">${body}</div>` : ''}


        <!-- 02c. කාරක හැඳින්වීම — විශේෂ සටහන් -->
        ${s.is_intro ? kkIntroNotes() : ''}

        <!-- 03. පාද සටහන් -->
        ${s.footnotes ? `
            <div class="panel-card">
                <details class="kk-foot kk-foot-card"><summary><span class="heading-icon">📝</span> පාද සටහන්</summary>${s.footnotes}</details>
            </div>
        ` : ''}

        ${kkPrevNext(s)}
    `;
}

// කාරක හැඳින්වීම — විශේෂ සටහන් (data/3_karaka/00_karaka_notes.js)
function kkIntroNotes() {
    const N = window.KarakaIntroNotes;
    if (!N || !N.sections) return '';
    return `
        <section class="panel-card kkn-panel" id="kkn-top">
            <h3 class="section-heading"><span class="heading-icon">📝</span> විශේෂ සටහන්</h3>
            <p class="kkn-source">${N.source}</p>
            <nav class="kkn-toc">${N.sections.map((x, i) =>
                `<a href="javascript:void(0)" onclick="kknGo('${x.id}')"><b>${i + 1}.</b> ${x.title}</a>`).join('')}</nav>
            ${N.sections.map((x, i) => `
                <article class="kkn-card" id="kkn-${x.id}">
                    <h4 class="kkn-title"><span class="kkn-no">${i + 1}</span>${x.title}</h4>
                    <div class="kkn-body">${x.html}</div>
                </article>`).join('')}
        </section>`;
}
function kknGo(id) {
    const el = document.getElementById('kkn-' + id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// සූත්‍රයට අදාළ විශේෂ සටහන් (data/3_karaka/karaka_sutta_notes.js)
function kkTreeHtml(nodes, depth) {
    return `<ul class="kkt-level kkt-d${depth}">${nodes.map(n => `
        <li>
            <div class="kkt-node${n.ex ? ' kkt-leaf' : ''}">
                <span class="kkt-label">${n.label}</span>
                ${n.ex ? `<span class="kkt-ex"><span class="kkt-pali">${n.ex}</span><span class="kkt-si">${n.si || ''}</span></span>` : ''}
            </div>
            ${n.children ? kkTreeHtml(n.children, depth + 1) : ''}
        </li>`).join('')}</ul>`;
}
function kkSuttaNotes(s) {
    if (s.is_intro) return '';
    const list = ((window.KarakaSuttaNotes || {})[s.sutta_number] || [])
        .concat((window.KarakaDocNotes || {})[s.sutta_number] || []);
    if (!list.length) return '';
    return `
        <section class="panel-card kkn-panel">
            <h3 class="section-heading"><span class="heading-icon">📝</span> විශේෂ සටහන්</h3>
            ${list.length > 2 ? `<nav class="kkn-toc">${list.map((n, i) =>
                `<a href="javascript:void(0)" onclick="kknGo('s${s.sutta_number}-${i}')"><b>${i + 1}.</b> ${n.title}</a>`).join('')}</nav>` : ''}
            ${list.map((n, i) => `
                <article class="kkn-card${n.kind === 'refs' ? ' kkn-card-refs' : ''}" id="kkn-s${s.sutta_number}-${i}">
                    <h4 class="kkn-title"><span class="kkn-no">${i + 1}</span>${n.title}</h4>
                    ${n.source ? `<p class="kkn-source">${n.source}</p>` : ''}
                    ${n.context ? `<p class="kkn-context"><span>අදාළ පාඨය:</span> ${n.context}</p>` : ''}
                    ${n.tree ? `<div class="kkt-tree">${kkTreeHtml(n.tree, 0)}</div>` : ''}
                    ${n.html ? `<div class="kkn-body kk-notes-body">${n.html}</div>` : ''}
                </article>`).join('')}
        </section>`;
}
