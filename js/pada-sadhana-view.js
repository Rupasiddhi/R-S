/**
 * ==========================================================================
 * නාමකණ්ඩ — පද සාධන වැඩබිම (js/pada-sadhana-view.js)
 * එක් නාම පදයක් විභක්ති සියල්ලට වරනඟා, විභක්තියක් / රූපයක් ක්ලික් කළ විට
 * එහි සම්පූර්ණ පද සාධනය පෙන්වයි.
 * (පියවර වගුව සඳහා nama-view.js හි renderNamaDerivationTable භාවිත කරයි)
 * ==========================================================================
 */

function isPadaSadhanaSubKhanda(subId) {
    return typeof subId === 'string' && subId.endsWith('_sadhana');
}

// විභක්තියකට අයත් සාධන (මුල් index සමඟ)
function padaSadhanaOfVibhatti(item, vkey) {
    return (item.derivations || [])
        .map((d, i) => ({ d, i }))
        .filter(o => o.d.vibhatti_key === vkey);
}

// 1. වරනැඟීමේ වගුව
function renderPadaSadhanaGrid(item, activeIdx, activeVib) {
    const cell = (vkey, label) => {
        const chips = padaSadhanaOfVibhatti(item, vkey)
            .filter(o => o.d.vacana === label)
            .map(o => `<button type="button" class="ps-form-chip ${o.i === activeIdx ? 'active' : ''} ${o.d.saddaniti_only ? 'ps-sd-only' : ''}" data-idx="${o.i}" title="${o.d.word} — ${o.d.saddaniti_only ? 'සද්දනීති පදමාලා රූපය; ' : ''}පද සාධනය බලන්න" onclick="switchPadaSadhana(${o.i})">${o.d.word}</button>`)
            .join('');
        return chips || '<span class="ps-empty">—</span>';
    };
    return `
        <div class="table-responsive">
            <table class="data-table ps-decl-table">
                <thead>
                    <tr>
                        <th style="width: 120px;">${item.verb ? 'කාරකය · පුරුෂය' : 'විභක්ති'}</th>
                        <th>එකවචන</th>
                        <th>බහුවචන</th>
                    </tr>
                </thead>
                <tbody>
                    ${(item.declension || []).map(row => `
                        <tr class="ps-decl-row ${row.key === activeVib ? 'active' : ''}" data-vib="${row.key}">
                            <td>
                                <button type="button" class="ps-vib-btn" title="${row.vibhatti} විභක්තියේ පද සාධනය බලන්න" onclick="selectPadaSadhanaVibhatti('${row.key}')">
                                    ${row.vibhatti} <span class="ps-arrow">▸</span>
                                </button>
                            </td>
                            <td><div class="ps-chip-row">${cell(row.key, 'එකවචන')}</div></td>
                            <td><div class="ps-chip-row">${cell(row.key, 'බහුවචන')}</div></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// එකවචන / බහුවචන මාරු කිරීමේ බොත්තම (එකම විභක්තිය තුළ)
const PS_VACANA = ['එකවචන', 'බහුවචන'];

function renderVacanaToggle(item, d, activeVib) {
    const forms = padaSadhanaOfVibhatti(item, activeVib);
    return `
        <span class="ps-vacana-toggle" role="group" aria-label="වචනය මාරු කරන්න">
            ${PS_VACANA.map(vac => {
                const has = forms.some(o => o.d.vacana === vac);
                const on = d.vacana === vac;
                return `<button type="button" class="ps-vac-btn ${on ? 'active' : ''}" ${has ? '' : 'disabled'}
                    aria-pressed="${on}" title="${has ? `${d.vibhatti} ${vac} රූපයට මාරු වන්න` : `${vac} රූපයක් නැත`}"
                    onclick="switchPadaSadhanaVacana('${vac}')">${vac}</button>`;
            }).join('')}
        </span>
    `;
}

// 2. සාධන කාඩ්පතේ අන්තර්ගතය (විභක්ති tabs + රූප tabs + සාධන වගුව)
function renderPadaSadhanaPanel(item, activeIdx, activeVib) {
    const d = (item.derivations || [])[activeIdx];
    const forms = padaSadhanaOfVibhatti(item, activeVib);
    return `
        <div class="ps-step-label"><span class="ps-step-no">1</span> ${item.verb ? 'කාරකය හා පුරුෂය තෝරන්න' : 'විභක්තිය තෝරන්න'}</div>
        <div class="ps-vib-tabs">
            ${(item.declension || []).map(row => `
                <button type="button" class="ps-vib-tab ${row.key === activeVib ? 'active' : ''}" onclick="selectPadaSadhanaVibhatti('${row.key}')">${row.vibhatti}</button>
            `).join('')}
        </div>

        <div class="ps-step-label"><span class="ps-step-no">2</span> රූපය තෝරන්න</div>
        <div class="ps-form-tabs">
            ${forms.map(o => `
                <button type="button" class="ps-form-tab ${o.i === activeIdx ? 'active' : ''}" onclick="switchPadaSadhana(${o.i})">
                    <span class="ps-form-tab-word">${o.d.word}</span>
                    <span class="ps-form-tab-vac">${o.d.vacana}</span>
                </button>
            `).join('')}
        </div>

        ${d ? `
            <div class="ps-now-showing">
                <span class="ps-now-label">පද සාධනය:</span>
                <span class="ps-deriv-tag">${d.vibhatti}</span>
                ${renderVacanaToggle(item, d, activeVib)}
                <span class="ps-deriv-word">${d.word}</span>
            </div>
            ${d.saddaniti_only ? `<div class="ps-sd-note">📗 මෙම රූපය <strong>සද්දනීති පදමාලාවෙහි</strong> එයි. රූපසිද්ධි සූත්‍රවලින් සෘජුව සාධනය නොවන හෙයින් ප්‍රකෘතිය, විභක්තිය හා වචනය දක්වා පමණක් පියවර දක්වා ඇත.</div>` : ''}
            ${renderNamaDerivationTable(d)}
        ` : ''}
    `;
}

function renderPadaSadhanaWorkspace(item, targetContainerId = 'viewSuttaPanel') {
    const container = document.getElementById(targetContainerId);
    if (!container || !item) return;

    const derivs = item.derivations || [];
    window.AppState.currentSutta = item;
    let idx = window.AppState.activeExampleIndex || 0;
    if (idx >= derivs.length) idx = 0;
    window.AppState.activeExampleIndex = idx;
    const vib = derivs[idx] ? derivs[idx].vibhatti_key : 'pathama';

    container.innerHTML = `
        <div class="panel-card nama-banner-card">
            <div class="tag-row" style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.4rem;">
                <span class="nama-category-badge">${item.sub_khanda_name || 'පද සාධනය'}</span>
                <span class="badge badge-khanda">${item.khanda_badge || 'නාමකණ්ඩ'}</span>
                ${item.ending ? `<span class="badge" style="background:#FAF2E6; color:#8C2D00; border:1px solid #E6D0BA;">${item.ending}</span>` : ''}
                ${item.source === 'saddaniti' ? `<span class="badge ps-sd-badge" title="${item.source_ref || ''}">📗 ${item.source_label || 'සද්දනීති පදමාලා'}</span>` : ''}
            </div>
            <h2 class="nama-sutta-title">${item.word} <span class="ps-title-sub">${item.verb ? '— ආඛ්‍යාත පද සාධනය' : `— ${item.ending || ''} ${item.linga || 'පුල්ලිඞ්ග'} ශබ්දය`}</span></h2>
            <div class="nama-meaning-container">
                <p class="nama-meaning-text">
                    ${item.verb ? '' : `<strong>${item.word}</strong> — `}${item.meaning || ''}
                    ${item.sutta_refs ? `<br><span class="ps-refs">අදාළ විශේෂ සූත්‍ර: ${item.sutta_refs}</span>` : ''}
                    ${item.source === 'saddaniti' ? `<br><span class="ps-refs ps-sd-src">මූලාශ්‍රය: ${item.source_ref || 'සද්දනීතිප්පකරණං (පදමාලා)'} — රූපසිද්ධියෙහි වෙනම පද සාධනයක් නැති පදයකි.</span>` : ''}
                </p>
            </div>
        </div>

        ${(item.stem_steps && item.stem_steps.length) ? `
            <div class="panel-card nama-derivation-card">
                <h3 class="section-heading"><span class="heading-icon">🌱</span> ප්‍රකෘති සාධනය (${item.word} ශබ්දය සිද්ධ වන අයුරු)</h3>
                ${renderNamaDerivationTable({ steps: item.stem_steps, final_result: item.word })}
            </div>
        ` : ''}

        ${item.hide_declension ? '' : `
        <div class="panel-card">
            <h3 class="section-heading"><span class="heading-icon">📜</span> ${item.verb ? 'රූප වගුව (කාරක · පුරුෂ · වචන)' : 'විභක්ති වරනැඟීම'}</h3>
            <div class="ps-hint-box">
                <span class="ps-hint-icon">👆</span>
                <span><strong>විභක්තියක නමක්</strong> හෝ <strong>රූපයක්</strong> ක්ලික් කරන්න — එහි සූත්‍ර සහිත සම්පූර්ණ පද සාධනය පහත <strong>“සම්පූර්ණ පද සාධනය”</strong> කොටසේ දිස් වේ.</span>
            </div>
            <div id="padaSadhanaGrid">${renderPadaSadhanaGrid(item, idx, vib)}</div>
            ${derivs.some(x => x.saddaniti_only) ? `<p class="ps-sd-legend"><span class="ps-form-chip ps-sd-only ps-legend-chip">රූපය</span> තිත් රේඛා සහිත රූප සද්දනීති පදමාලාවෙහි පමණක් එන, රූපසිද්ධියෙන් සෘජුව සාධනය නොවන රූපයි.</p>` : ''}
        </div>
        `}

        ${item.hide_declension ? `
        <div class="panel-card nama-derivation-card" id="padaSadhanaCard">
            <h3 class="section-heading"><span class="heading-icon">⚙️</span> සම්පූර්ණ පද සාධනය (පඨමා විභක්ති, එකවචන)</h3>
            ${derivs[0] ? renderNamaDerivationTable(derivs[0]) : ''}
        </div>
        ` : `
        <div class="panel-card nama-derivation-card" id="padaSadhanaCard">
            <h3 class="section-heading"><span class="heading-icon">⚙️</span> සම්පූර්ණ පද සාධනය</h3>
            <div id="padaSadhanaContainer">${renderPadaSadhanaPanel(item, idx, vib)}</div>
        </div>
        `}

        ${item.similar_words ? `
            <div class="panel-card">
                <h3 class="section-heading"><span class="heading-icon">🔁</span> මේ ලෙසම වරනැගෙන ශබ්ද</h3>
                <p class="ps-similar">${item.similar_words}</p>
            </div>
        ` : ''}

        ${(item.notes && item.notes.length) ? `
            <div class="panel-card nama-commentary-card">
                <h3 class="section-heading"><span class="heading-icon">📖</span> සටහන්</h3>
                <div class="nama-commentary-text">
                    ${item.notes.map(n => `<p class="ps-note">• ${n}</p>`).join('')}
                </div>
            </div>
        ` : ''}

        ${renderNamaGathaSanna(item)}
        ${renderAkhyataVaranagilla(item)}
    `;
}

// තෝරාගැනීම අනුව වගුව හා සාධන කාඩ්පත යාවත්කාලීන කිරීම (DOM-Direct)
function updatePadaSadhanaView(index, scroll) {
    const item = window.AppState && window.AppState.currentSutta;
    if (!item || !item.derivations || !item.derivations[index]) return;
    window.AppState.activeExampleIndex = index;
    const vib = item.derivations[index].vibhatti_key;

    document.querySelectorAll('.ps-form-chip').forEach(el => {
        el.classList.toggle('active', Number(el.dataset.idx) === index);
    });
    document.querySelectorAll('.ps-decl-row').forEach(el => {
        el.classList.toggle('active', el.dataset.vib === vib);
    });

    const box = document.getElementById('padaSadhanaContainer');
    if (box) box.innerHTML = renderPadaSadhanaPanel(item, index, vib);

    if (scroll) {
        const card = document.getElementById('padaSadhanaCard');
        if (card && card.scrollIntoView) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// රූපයක් ක්ලික් කිරීම
function switchPadaSadhana(index) {
    const fromGrid = !!(document.activeElement && document.activeElement.classList.contains('ps-form-chip'));
    updatePadaSadhanaView(index, fromGrid);
}

// එකවචන ↔ බහුවචන මාරු කිරීම — එකම විභක්තියේ, හැකි නම් එම අනුපිළිවෙළේම රූපයට
function switchPadaSadhanaVacana(vac) {
    const item = window.AppState && window.AppState.currentSutta;
    if (!item || !item.derivations) return;
    const cur = item.derivations[window.AppState.activeExampleIndex || 0];
    if (!cur) return;
    if (!vac) vac = cur.vacana === PS_VACANA[0] ? PS_VACANA[1] : PS_VACANA[0];
    if (cur.vacana === vac) return;

    const forms = padaSadhanaOfVibhatti(item, cur.vibhatti_key);
    const same = forms.filter(o => o.d.vacana === cur.vacana);
    const target = forms.filter(o => o.d.vacana === vac);
    if (!target.length) return;
    const pos = Math.max(0, same.findIndex(o => o.d === cur));
    updatePadaSadhanaView(target[Math.min(pos, target.length - 1)].i, false);
}

// යතුරුපුවරුවෙන්: V — වචනය මාරු කිරීම
document.addEventListener('keydown', (e) => {
    if (e.key !== 'v' && e.key !== 'V') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;
    if (!document.getElementById('padaSadhanaContainer')) return;
    switchPadaSadhanaVacana();
});

// විභක්තියක් ක්ලික් කිරීම — එහි පළමු රූපයේ සාධනය පෙන්වයි
function selectPadaSadhanaVibhatti(vkey) {
    const item = window.AppState && window.AppState.currentSutta;
    if (!item) return;
    const first = padaSadhanaOfVibhatti(item, vkey)[0];
    if (!first) return;
    const fromGrid = !!(document.activeElement && document.activeElement.classList.contains('ps-vib-btn'));
    updatePadaSadhanaView(first.i, fromGrid);
}


// නාම වරනැඟිල්ලෙහි ගාථා සන්නය (1873 මුද්‍රණය) — අදාළ සද්දසම ගාථා හා පදයෙන් පද සන්නය (ක්ලික් කළ පසු විවෘත වේ)
function renderNamaGathaSanna(item) {
    const G = window.NamaGathaSanna;
    if (!G || !item || item.source === 'saddaniti') return '';
    const ids = ((G.map || {})[item.sub_khanda_id] || {})[item.word];
    if (!ids || !ids.length) return '';
    const blocks = ids.map(id => G.sections[id]).filter(Boolean).map(s => `
        <details class="gs-item">
            <summary>${s.title} <span class="gs-hint">(බැලීමට ක්ලික් කරන්න)</span></summary>
            <div class="gs-body">${s.html}</div>
        </details>`).join('');
    if (!blocks) return '';
    return `
        <div class="panel-card nama-commentary-card gs-card">
            <h3 class="section-heading"><span class="heading-icon">📜</span> සද්දසම ගාථා සන්නය <span class="gs-hint">(නාම වරනැඟිල්ල — 1873 මුද්‍රණය)</span></h3>
            ${blocks}
        </div>`;
}

// ආඛ්‍යාත වරනැඟිල්ල (ආඛ්‍යාතික පදමාලා) හා ව්‍යාඛ්‍යාව (1873 මුද්‍රණය) — ආඛ්‍යාත පද සාධන පිටුවල අමතර කොටස්
function renderAkhyataVaranagilla(item) {
    const A = window.AkhyataVaranagilla;
    if (!A || !item || !item.verb || item.sub_khanda_id !== '05b_akhyata_pada_sadhana') return '';
    const name = Object.keys(A.tenseNames).find(n => String(item.word || '').indexOf(n) !== -1);
    if (!name) return '';
    const key = A.tenseNames[name];
    const ten = A.tenses[key];
    const secById = {};
    A.sections.forEach(s => { secById[s.key] = s; });
    const ids = (A.tenseSections[key] || []).concat(key === 'vatta' ? A.generalSections : []);
    const extra = renderAvSections(ids, secById, key === 'vatta' ? A.lead : '');
    return `
        <div class="panel-card nama-commentary-card gs-card av-card">
            <h3 class="section-heading"><span class="heading-icon">📜</span> ආඛ්‍යාතික පදමාලාව <span class="gs-hint">(ආඛ්‍යාත වරනැඟිල්ල — 1873 මුද්‍රණය)</span></h3>
            <p class="av-tmean"><strong>${name}</strong> — ${ten.tmean}</p>
            <div class="av-wrap">${ten.html}</div>
            ${key === 'vatta' && A.tenses.caus ? `
                <details class="gs-item av-sec"><summary>හෙතුකත්තරි — කාරිත පදමාලාව <span class="gs-hint">(බැලීමට ක්ලික් කරන්න)</span></summary>
                <div class="gs-body"><p class="av-tmean">${A.tenses.caus.tmean}</p><div class="av-wrap">${A.tenses.caus.html}</div></div></details>` : ''}
        </div>
        ${extra ? `
        <div class="panel-card nama-commentary-card gs-card">
            <h3 class="section-heading"><span class="heading-icon">📖</span> ආඛ්‍යාත ව්‍යාඛ්‍යාව <span class="gs-hint">(සිංහල විවරණය — 1873 මුද්‍රණය)</span></h3>
            ${extra}
        </div>` : ''}`;
}

// ==========================================================================
// ආඛ්‍යාත ව්‍යාඛ්‍යාව — අන්තර්ගතය පැහැදිළිව හා නිර්මාණශීලීව දැක්වීම
//  • “…” ඇතුළත පාළි පාඨ වෙනම ලේබල් ලෙස
//  • "පදය, අර්ථය;" ආකාරයේ ඡේද → පද-අර්ථ සටහන් (කාඩ්පත් ජාලයක්)
//  • " — " වලින් බෙදුණු දිගු ඡේද → අංක සහිත පියවර රේඛාවක්
//  • පාළි උද්ධෘත → උද්ධෘත කාඩ්පත්; එක් එක් කොටසට අයිකනයක් හා සාරාංශයක්
// (මූල දත්ත වෙනස් නොකරයි — පෙන්වීමේදී පමණක් සකස් කරයි)
// ==========================================================================
const AV_ICONS = {
    'v-lakkhana': '🔖', 'v-kala': '🕰️', 'v-purisa': '👤', 'v-vibhatti': '🧩', 'v-sakamma': '🎯', 'v-kattu': '📝',
    'v-padakkama': '🔗', 'v-kala6': '⏳', 'v-missa': '🔀', 'v-kamma': '🔄', 'v-bhava': '🌱', 'v-panc': '📣',
    'v-panc-rs': '📚', 'v-anagata': '🌅', 'v-satt': '🤔', 'v-hiya': '🌙', 'v-paro': '🔭', 'v-ajja': '🌤️',
    'v-bhav': '🚀', 'v-kala8': '⛔', 'v-nama': '🏷️', 'v-hetu': '⚙️', 'v-kamma-count': '🔢', 'v-iccha': '💭',
    'v-namadhatu': '🧬', 'v-gana': '🗂️'
};

function avText(s) { return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }

// “…” ඇතුළත පාළි පාඨ ලේබල් කිරීම
function avQuotes(html) {
    return html.replace(/“([^“”<>]{1,90})”/g, '<q class="avx-q">$1</q>');
}

// "පදය, අර්ථය; පදය, අර්ථය;" ආකාරයේ ඡේදයක් පද-අර්ථ ලැයිස්තුවක් බවට
function avGloss(text) {
    const parts = text.split(/;\s+/).map(x => x.trim()).filter(Boolean);
    if (parts.length < 4) return null;
    const rows = [];
    for (const p of parts) {
        const m = p.match(/^([^,;()“”—]{1,32}),\s+(.{2,}?)[;.]?$/);
        if (m) rows.push([m[1].trim(), m[2].trim()]);
    }
    if (rows.length < 4 || rows.length / parts.length < 0.7) return null;
    return `<div class="avx-gloss">${rows.map(r => `<div class="avx-gl"><b>${r[0]}</b><span>${avQuotes(r[1])}</span></div>`).join('')}</div>`;
}

// " — " වලින් බෙදුණු ඡේදයක් පියවර රේඛාවක් බවට
function avSteps(inner) {
    const raw = inner.split(/\s+—\s+/).map(x => x.trim()).filter(Boolean);
    const pieces = [];
    raw.forEach(p => { if (pieces.length && p.length < 14) pieces[pieces.length - 1] += ' — ' + p; else pieces.push(p); });
    if (pieces.length < 3) return null;
    return `<ol class="avx-steps">${pieces.map(p => `<li>${avQuotes(p)}</li>`).join('')}</ol>`;
}

function avEnhanceHtml(html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    const out = [];
    Array.from(tpl.content.childNodes).forEach(n => {
        if (n.nodeType !== 1) { if (n.textContent.trim()) out.push(`<p class="avx-p">${avQuotes(n.textContent)}</p>`); return; }
        const cls = n.className || '';
        if (n.tagName === 'BLOCKQUOTE') {
            const isVerse = /verse/.test(cls);
            out.push(`<figure class="avx-quote ${isVerse ? 'is-verse' : ''}"><span class="avx-qmark">❝</span><div>${n.innerHTML}</div></figure>`);
        } else if (n.tagName === 'P' && /av-para/.test(cls)) {
            const g = avGloss(avText(n.innerHTML));
            if (g) { out.push(`<div class="avx-tag">📖 පද – අර්ථ</div>${g}`); return; }
            const s = avSteps(n.innerHTML);
            out.push(s ? `<div class="avx-tag">🧭 පියවරින් පියවර</div>${s}` : `<p class="avx-p">${avQuotes(n.innerHTML)}</p>`);
        } else if (n.tagName === 'P' && /av-head/.test(cls)) {
            out.push(`<p class="avx-end">${n.innerHTML}</p>`);
        } else {
            out.push(n.outerHTML);
        }
    });
    return out.join('');
}

function avSnippet(html) {
    const t = avText(html).replace(/[“”]/g, '');
    return t.length > 80 ? t.slice(0, 80).replace(/\s\S*$/, '') + '…' : t;
}

function avSection(s, no) {
    const body = avEnhanceHtml(s.html);
    const firstP = (s.html.match(/<p class="av-para">(.*?)<\/p>/) || [])[1] || '';
    return `
        <details class="avx-sec" id="avx-${s.key}">
            <summary>
                <span class="avx-no">${no}</span>
                <span class="avx-ico">${AV_ICONS[s.key] || '📘'}</span>
                <span class="avx-title">${s.title}${firstP ? `<small>${avSnippet(firstP)}</small>` : ''}</span>
                <span class="avx-chev" aria-hidden="true"></span>
            </summary>
            <div class="avx-body">${body}</div>
        </details>`;
}

function avToggleAll(btn, open) {
    const box = btn.closest('.avx-wrap');
    if (box) box.querySelectorAll('details.avx-sec').forEach(d => { d.open = open; });
}

function avJump(id) {
    const d = document.getElementById('avx-' + id);
    if (!d) return;
    d.open = true;
    d.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderAvSections(ids, secById, lead) {
    const secs = ids.map(id => secById[id]).filter(Boolean);
    if (!secs.length) return '';
    return `
        <div class="avx-wrap">
            ${lead ? `<div class="avx-lead">${avEnhanceHtml(lead)}</div>` : ''}
            <div class="avx-toolbar">
                <div class="avx-chips">${secs.map((s, i) => `<button type="button" class="avx-chip" onclick="avJump('${s.key}')" title="${s.title}"><span>${AV_ICONS[s.key] || '📘'}</span>${i + 1}</button>`).join('')}</div>
                <span class="avx-btns">
                    <button type="button" class="avx-btn" onclick="avToggleAll(this, true)">⤵ සියල්ල විවෘත කරන්න</button>
                    <button type="button" class="avx-btn" onclick="avToggleAll(this, false)">⤴ සියල්ල වසන්න</button>
                </span>
            </div>
            ${secs.map((s, i) => avSection(s, i + 1)).join('')}
        </div>`;
}
