/**
 * ==========================================================================
 * සර සන්ධි Rendering Controller (js/sara-view.js)
 * ==========================================================================
 */

// Global state එකක් නැතිනම් initialize කරගැනීම
window.AppState = window.AppState || {};

// Markdown bold (**...**) HTML <strong> බවට හරවන Helper ශ්‍රිතය
function parseSaraMarkdownBold(text) {
    if (!text) return '';
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// ලෝපය, ආදේශ සහ ඊතල හැඩගැස්වීම
function formatSaraFormula(text) {
    if (!text) return '';
    let formatted = text.replace(/~([^~]+)~/g, '<span class="lopa-cut">$1</span>');
    formatted = formatted.replace(/([^\s~→\-+()<>]+)→([^\s~→\-+()<>]+)/g, function (m, a, b) { return '<span class="sub-ul">' + a + '<span style="color: var(--theme-accent); font-weight: bold; margin: 0 2px;">➔</span>' + b + '</span>'; });
    formatted = formatted.replace(/→/g, '<span style="color: var(--theme-accent); font-weight: bold; margin: 0 4px;">➔</span>');
    formatted = formatted.replace(/\[(.*?)\]/g, '<span style="background: var(--theme-tint); border: 1px solid var(--border-soft); padding: 1px 6px; border-radius: 4px; color: #8C2D00; font-weight: 700;">$1</span>');
    return formatted;
}

// සූත්‍රයෙන් සෑදෙන සියලු පද හා ප්‍රභේද
function renderSaraFormedWords(formedWords) {
    if (!formedWords || formedWords.length === 0) return '';

    const hasCategories = formedWords.some(item => item.includes(':'));

    if (!hasCategories) {
        return `
            <div class="panel-card sara-formed-card">
                <h3 class="section-heading"><span class="heading-icon">✨</span> සූත්‍රයෙන් සෑදෙන සියලු පද</h3>
                <div class="sara-words-badges">
                    ${formedWords.map(word => `<span class="sara-word-badge">${word.trim()}</span>`).join('')}
                </div>
            </div>
        `;
    }

    return `
        <div class="panel-card sara-formed-card">
            <h3 class="section-heading"><span class="heading-icon">✨</span> සූත්‍රයෙන් සෑදෙන සියලු පද හා ප්‍රභේද</h3>
            <div class="sara-formed-groups">
                ${formedWords.map(item => {
                    const parts = item.split(':');
                    const categoryTitle = parts.length > 1 ? parts[0].trim() : '';
                    const wordsString = parts.length > 1 ? parts[1].trim() : parts[0].trim();
                    const wordsList = wordsString.split(',').map(w => w.trim()).filter(Boolean);

                    return `
                        <div class="sara-group-box">
                            ${categoryTitle ? `<div class="sara-group-title"><span class="group-bullet">⚜️</span> ${categoryTitle}</div>` : ''}
                            <div class="sara-words-badges">
                                ${wordsList.map(word => `<span class="sara-word-badge">${word}</span>`).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// ෂඩාකාර කාඩ්පත් Helper
function renderSaraShadakaraCards(shadakara) {
    const modes = [
        { key: 'sambandha', paliKey: 'sambandha_pali', label: '1. සම්බන්ධො', icon: '1' },
        { key: 'pada', paliKey: 'pada_pali', label: '2. පදං', icon: '2' },
        { key: 'padattha', paliKey: 'padattha_pali', label: '3. පදත්‍ථො', icon: '3' },
        { key: 'padaviggaha', paliKey: 'padaviggaha_pali', label: '4. පදවිග්ගහො', icon: '4' },
        { key: 'chodana', paliKey: 'chodana_pali', label: '5. චොදනා', icon: '5' },
        { key: 'parihara', paliKey: 'parihara_pali', label: '6. පරිහාරො', icon: '6' }
    ];

    return modes.map(m => {
        const meaning = shadakara[m.key];
        const pali = shadakara[m.paliKey];
        if (!meaning && !pali) return '';
        return `
            <div class="shad-aspect-card">
                <div class="shad-card-header">
                    <span class="shad-number-badge">${m.icon}</span>
                    <h4 class="shad-card-title">${m.label}</h4>
                </div>
                ${pali ? `<div class="shad-lakkhana-box">${pali}</div>` : ''}
                <div class="shad-card-desc">${meaning || '--'}</div>
            </div>
        `;
    }).join('');
}

// පද සාධන වගු Helper
function renderSaraDerivationTable(example) {
    if (!example) return '<div class="text-muted p-3">සාධන පියවර නොමැත.</div>';
    return `
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 60px; text-align: center;">පියවර</th>
                        <th>සාධන පියවර / ක්‍රියාවලිය</th>
                        <th style="width: 280px;">අදාළ සූත්‍රය / නීතිය</th>
                    </tr>
                </thead>
                <tbody>
                    ${(example.steps || []).map((st, i) => `
                        <tr>
                            <td style="text-align: center; font-weight: bold; color: var(--text-muted);">${i + 1}</td>
                            <td style="font-size: 1.05rem; font-weight: 600;">${formatSaraFormula(st.formula || st.action)}</td>
                            <td><span class="rule-badge">${st.rule || '-'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="sara-siddha-box">
            <span class="sara-result-label">සිද්ධ රූපය (අවසන් ඵලය):</span>
            <span class="sara-result-word">${example.final_result || example.word}</span>
        </div>
    `;
}

// ප්‍රධාන Workspace Rendering Function
function renderSaraWorkspace(suttaData, targetContainerId = 'viewSuttaPanel') {
    const container = document.getElementById(targetContainerId);
    if (!container || !suttaData) return;

    // සූත්‍රය සහ Active Index එක State එකට save කිරීම (Sync ගැටලුව වැළැක්වීමට)
    window.AppState.currentSutta = suttaData;
    window.AppState.activeExampleIndex = window.AppState.activeExampleIndex || 0;

    const examples = suttaData.examples || [];
    if (window.AppState.activeExampleIndex >= examples.length) {
        window.AppState.activeExampleIndex = 0;
    }
    const activeIndex = window.AppState.activeExampleIndex;
    const currentExample = examples[activeIndex] || null;

    container.innerHTML = `
        <!-- 01. සූත්‍ර Top Banner -->
        <div class="panel-card sara-banner-card">
            <div class="tag-row" style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem;">
                <span class="sara-category-badge">${suttaData.category_badge || 'සර සන්ධි'}</span>
                <span class="badge badge-khanda">${suttaData.khanda_badge || 'සන්ධිකණ්ඩ'}</span>
                ${suttaData.sutta_type ? `<span class="badge" style="background:var(--theme-tint); color:#8C2D00; border:1px solid var(--border-soft);">${suttaData.sutta_type}</span>` : ''}
            </div>
            
            <h2 class="sara-sutta-title">${suttaData.sutta_name || suttaData.sutta}</h2>

            <!-- සූත්‍රයේ තේරුම -->
            ${suttaData.sutta_meaning ? `
                <div class="sara-meaning-container">
                    <p class="sara-meaning-text">${parseSaraMarkdownBold(suttaData.sutta_meaning)}</p>
                </div>
            ` : ''}

            <!-- වෘත්තිය සහ සන්නය -->
            ${(suttaData.vutti || suttaData.vutti_sanna) ? `
                <div class="sara-vutti-container">
                    ${suttaData.vutti ? `
                        <span class="vutti-label">සූත්‍ර වෘත්තිය (පාළි):</span>
                        <p class="sara-vutti-text">${suttaData.vutti}</p>
                    ` : ''}
                    
                    ${suttaData.vutti && suttaData.vutti_sanna ? `<hr class="sara-sanna-divider">` : ''}
                    
                    ${suttaData.vutti_sanna ? `
                        <span class="vutti-label">වෘත්තියේ පදයෙන් පද සන්නය:</span>
                        <p class="sara-sanna-text">${parseSaraMarkdownBold(suttaData.vutti_sanna)}</p>
                    ` : ''}
                </div>
            ` : ''}
        </div>

        <!-- 02. ෂඩාකාර විමර්ශනය -->
        ${suttaData.shadakara ? `
            <div class="panel-card">
                <h3 class="section-heading"><span class="heading-icon">⚜️</span> සූත්‍ර ෂඩාකාර විමර්ශනය</h3>
                <div class="shadakara-dynamic-grid">
                    ${renderSaraShadakaraCards(suttaData.shadakara)}
                </div>
            </div>
        ` : ''}

        <!-- 02b. සන්නය (රූපසිද්ධි පාඨය හා පදයෙන් පද සන්නය) -->
        ${renderSaraRupaSanna(suttaData)}

        <!-- 03. සූත්‍රයෙන් සෑදෙන සියලු පද -->
        ${renderSaraFormedWords(suttaData.formed_words)}

        <!-- 04. සෑදිය නොහැකි පද / ප්‍රත්‍යුදාහරණ -->
        ${suttaData.counter_examples ? `
            <div class="panel-card sara-counter-card">
                <h3 class="section-heading"><span class="heading-icon">🚫</span> සෑදිය නොහැකි පද / නීතිය නොවළඳින තැන් (ප්‍රත්‍යුදාහරණ)</h3>
                <div class="sara-counter-content">
                    ${Array.isArray(suttaData.counter_examples) 
                        ? suttaData.counter_examples.map(ce => `<div class="counter-line">✖ ${ce}</div>`).join('') 
                        : `<div class="counter-line">✖ ${suttaData.counter_examples}</div>`}
                </div>
            </div>
        ` : ''}

        <!-- 05. සන්න, ටීකා හා න්‍යාස විශේෂ විමර්ශන -->
        ${suttaData.extended_commentary ? `
            <div class="panel-card sara-commentary-card">
                <h3 class="section-heading"><span class="heading-icon">📖</span> සන්න, ටීකා හා න්‍යාස විශේෂ විවරණ</h3>
                <div class="sara-commentary-text">
                    ${suttaData.extended_commentary}
                </div>
            </div>
        ` : ''}

        <!-- 05b. විශේෂ සටහන් -->
        ${renderSaraSpecialNotes(suttaData)}

        <!-- 05c. ටීකා විවරණ (ක්ලික් කර බැලීමට) -->
        ${renderSaraTika(suttaData)}

        <!-- 06. පියවරෙන් පියවර පද සාධන පුවරුව -->
        ${examples.length > 0 ? `
            <div class="panel-card sara-derivation-card">
                <h3 class="section-heading"><span class="heading-icon">⚙️</span> පියවරෙන් පියවර පද සාධන විධික්‍රමය</h3>
                
                <!-- උදාහරණ තේරීමේ Tabs -->
                <div class="example-tabs-list" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                    ${examples.map((ex, idx) => `
                        <button type="button" 
                                class="example-tab-btn ${idx === activeIndex ? 'active' : ''}" 
                                onclick="switchSaraExample(${idx})">
                            ${ex.word || `උදාහරණය ${idx + 1}`}
                        </button>
                    `).join('')}
                </div>

                <!-- සාධන පියවර වගුව රඳවන Container එක -->
                <div id="saraDerivationContainer">
                    ${currentExample ? renderSaraDerivationTable(currentExample) : ''}
                </div>
            </div>
        ` : ''}
    `;
}


// සමාසකණ්ඩය — සූත්‍රයට අදාළ විශේෂ සටහන් (data/4_samasa/samasa_sutta_notes.js)
function renderSaraSpecialNotes(suttaData) {
    const list = ((window.SamasaSuttaNotes || {})[suttaData.sutta_number] || []).concat((window.TaddhitaSuttaNotes || {})[suttaData.sutta_number] || []).concat((window.AkhyataSuttaNotes || {})[suttaData.sutta_number] || []).concat((window.KitakaSuttaNotes || {})[suttaData.sutta_number] || []);
    if (!list.length) return '';
    return `
        <section class="panel-card kkn-panel">
            <h3 class="section-heading"><span class="heading-icon">📝</span> විශේෂ සටහන් <span class="kk-tika-hint">(${list.length}) — බැලීමට ක්ලික් කරන්න</span></h3>
            ${list.map(n => `
                <details class="kk-tika sn-note"><summary><span class="kk-tika-icon">📝</span> <b>සටහන ${n.n}</b> — ${n.title}</summary>
                    <div class="kk-tika-body">
                        ${n.context ? `<div class="sanna-vutti-box kk-pair"><span class="vutti-label">අදාළ ඡේදය:</span><div class="sanna-vutti-text kk-html">${n.context}</div></div>` : ''}
                        <div class="kkn-body kk-notes-body" style="margin-top:0.6rem"><span class="vutti-label">සටහන:</span>${n.html}</div>
                    </div>
                </details>`).join('')}
        </section>`;
}

// සමාසකණ්ඩය — ටීකා විවරණ (ක්ලික් කළ විට විවෘත වේ) (data/4_samasa/samasa_tika.js)
function getSaraTikaList(suttaData) {
    return ((window.SamasaTika || {})[suttaData.sutta_number] || []).concat((window.TaddhitaTika || {})[suttaData.sutta_number] || []).concat((window.AkhyataTika || {})[suttaData.sutta_number] || []).concat((window.KitakaTika || {})[suttaData.sutta_number] || []);
}

// ෂඩාකාරයට පහළින් — රූපසිද්ධි සන්නය (විවෘතව, වෘත්තියේ පදයෙන් පද සන්නය ආකාරයෙන්)
function renderSaraRupaSanna(suttaData) {
    const items = getSaraTikaList(suttaData).filter(t => t.kind === 'rupa');
    if (!items.length) return '';
    return `
        <div class="panel-card sara-rupa-sanna-card">
            <h3 class="section-heading"><span class="heading-icon">📖</span> සන්නය <span class="kk-tika-hint">(රූපසිද්ධි විවරණය — පදයෙන් පද සන්නය)</span></h3>
            ${items.map(t => `
                <div class="sara-vutti-container sara-rupa-item">
                    ${t.title ? `<span class="sara-rupa-title">${t.title}</span>` : ''}
                    ${t.pali ? `
                        <span class="vutti-label">රූපසිද්ධි පාඨය (පාළි):</span>
                        <div class="sara-vutti-text kk-html">${t.pali}</div>
                    ` : ''}
                    ${t.pali && t.sanna ? `<hr class="sara-sanna-divider">` : ''}
                    ${t.sanna ? `
                        <span class="vutti-label">පදයෙන් පද සන්නය:</span>
                        <div class="sara-sanna-text kk-html kk-pair-sanna">${t.sanna}</div>
                    ` : ''}
                </div>`).join('')}
        </div>`;
}

function renderSaraTika(suttaData) {
    const list = getSaraTikaList(suttaData).filter(t => t.kind !== 'rupa');
    if (!list.length) return '';
    const mk = (items, icon, title, lbl1, lbl2) => !items.length ? '' : `
        <section class="panel-card kkn-panel">
            <h3 class="section-heading"><span class="heading-icon">${icon}</span> ${title} <span class="kk-tika-hint">(${items.length}) — බැලීමට ක්ලික් කරන්න</span></h3>
            ${items.map(t => `
                <details class="kk-tika"><summary><span class="kk-tika-icon">${icon}</span> ${t.source ? `<b>${t.source}</b> — ` : ''}${t.title}</summary>
                    <div class="kk-tika-body"><div class="sanna-vutti-box kk-pair">
                        ${t.pali ? `<span class="vutti-label">${lbl1}</span><div class="sanna-vutti-text kk-html">${t.pali}</div>` : ''}
                        ${t.pali && t.sanna ? `<hr class="sanna-sanna-divider">` : ''}
                        ${t.sanna ? `<span class="vutti-label">${lbl2}</span><div class="sanna-sanna-text kk-html kk-pair-sanna">${t.sanna}</div>` : ''}
                    </div></div>
                </details>`).join('')}
        </section>`;
    return mk(list, '📜', 'ටීකා විවරණ', 'ටීකා පාඨය:', 'පදයෙන් පද සන්නය:');
}

// උදාහරණ Tab ක්ලික් කළ විට ක්‍රියාත්මක වන සෘජු ශ්‍රිතය (DOM-Direct Switch)
function switchSaraExample(index) {
    if (!window.AppState) window.AppState = {};
    window.AppState.activeExampleIndex = index;

    const currentSutta = window.AppState.currentSutta;
    if (!currentSutta || !currentSutta.examples) return;

    // 1. Tab buttons වල active class එක මාරු කිරීම
    const buttons = document.querySelectorAll('.example-tabs-list .example-tab-btn');
    buttons.forEach((btn, idx) => {
        if (idx === index) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 2. මුළු පිටුවම reload නොකර සාධන වගුව පමණක් update කිරීම
    const derivationContainer = document.getElementById('saraDerivationContainer');
    if (derivationContainer) {
        const example = currentSutta.examples[index];
        derivationContainer.innerHTML = renderSaraDerivationTable(example);
    } else {
        // Container එක සොයාගත නොහැකි නම් පමණක් workspace එක re-render කරයි
        renderSaraWorkspace(currentSutta);
    }
}