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
                        <th style="width: 120px;">විභක්ති</th>
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
        <div class="ps-step-label"><span class="ps-step-no">1</span> විභක්තිය තෝරන්න</div>
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
                <span class="badge badge-khanda">නාමකණ්ඩ</span>
                ${item.ending ? `<span class="badge" style="background:#FAF2E6; color:#8C2D00; border:1px solid #E6D0BA;">${item.ending}</span>` : ''}
                ${item.source === 'saddaniti' ? `<span class="badge ps-sd-badge" title="${item.source_ref || ''}">📗 ${item.source_label || 'සද්දනීති පදමාලා'}</span>` : ''}
            </div>
            <h2 class="nama-sutta-title">${item.word} <span class="ps-title-sub">— ${item.ending || ''} ${item.linga || 'පුල්ලිඞ්ග'} ශබ්දය</span></h2>
            <div class="nama-meaning-container">
                <p class="nama-meaning-text">
                    <strong>${item.word}</strong> — ${item.meaning || ''}
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

        <div class="panel-card">
            <h3 class="section-heading"><span class="heading-icon">📜</span> විභක්ති වරනැඟීම</h3>
            <div class="ps-hint-box">
                <span class="ps-hint-icon">👆</span>
                <span><strong>විභක්තියක නමක්</strong> හෝ <strong>රූපයක්</strong> ක්ලික් කරන්න — එහි සූත්‍ර සහිත සම්පූර්ණ පද සාධනය පහත <strong>“සම්පූර්ණ පද සාධනය”</strong> කොටසේ දිස් වේ.</span>
            </div>
            <div id="padaSadhanaGrid">${renderPadaSadhanaGrid(item, idx, vib)}</div>
            ${derivs.some(x => x.saddaniti_only) ? `<p class="ps-sd-legend"><span class="ps-form-chip ps-sd-only ps-legend-chip">රූපය</span> තිත් රේඛා සහිත රූප සද්දනීති පදමාලාවෙහි පමණක් එන, රූපසිද්ධියෙන් සෘජුව සාධනය නොවන රූපයි.</p>` : ''}
        </div>

        <div class="panel-card nama-derivation-card" id="padaSadhanaCard">
            <h3 class="section-heading"><span class="heading-icon">⚙️</span> සම්පූර්ණ පද සාධනය</h3>
            <div id="padaSadhanaContainer">${renderPadaSadhanaPanel(item, idx, vib)}</div>
        </div>

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
