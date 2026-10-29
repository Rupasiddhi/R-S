/**
 * ==========================================================================
 * පකති සන්ධි Rendering Controller (js/pakati-view.js)
 * ==========================================================================
 */

window.AppState = window.AppState || {};

// Markdown bold (**...**) HTML <strong> බවට හරවන Helper ශ්‍රිතය
function parsePakatiMarkdownBold(text) {
    if (!text) return '';
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// සූත්‍රයෙන් සෑදෙන සියලු පද හා ප්‍රභේද - Compact Wrapping Badges Layout
function renderPakatiFormedWords(formedWords) {
    if (!formedWords || formedWords.length === 0) return '';

    const hasCategories = formedWords.some(item => item.includes(':'));

    if (!hasCategories) {
        return `
            <div class="panel-card pakati-formed-card">
                <h3 class="section-heading"><span class="heading-icon">✨</span> සූත්‍රයෙන් සෑදෙන සියලු පද</h3>
                <div class="pakati-words-badges">
                    ${formedWords.map(word => `<span class="pakati-word-badge">${word.trim()}</span>`).join('')}
                </div>
            </div>
        `;
    }

    return `
        <div class="panel-card pakati-formed-card">
            <h3 class="section-heading"><span class="heading-icon">✨</span> සූත්‍රයෙන් සෑදෙන සියලු පද හා ප්‍රභේද</h3>
            <div class="pakati-formed-groups">
                ${formedWords.map(item => {
                    const parts = item.split(':');
                    const categoryTitle = parts.length > 1 ? parts[0].trim() : '';
                    const wordsString = parts.length > 1 ? parts[1].trim() : parts[0].trim();
                    const wordsList = wordsString.split(',').map(w => w.trim()).filter(Boolean);

                    return `
                        <div class="pakati-group-box">
                            ${categoryTitle ? `<div class="pakati-group-title"><span class="group-bullet">⚜️</span> ${categoryTitle}</div>` : ''}
                            <div class="pakati-words-badges">
                                ${wordsList.map(word => `<span class="pakati-word-badge">${word}</span>`).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// ෂඩාකාර කාඩ්පත් Helper (Justified Alignment සමඟ)
function renderPakatiShadakaraCards(shadakara) {
    if (!shadakara) return '';
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
function renderPakatiDerivationTable(example) {
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
                            <td style="font-size: 1.05rem; font-weight: 600;">${st.formula || st.action}</td>
                            <td><span class="rule-badge">${st.rule || '-'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="pakati-siddha-box">
            <span class="pakati-result-label">සිද්ධ රූපය (අවසන් ඵලය):</span>
            <span class="pakati-result-word">${example.final_result || example.word}</span>
        </div>
    `;
}

// ප්‍රධාන Workspace Rendering Function
function renderPakatiWorkspace(suttaData, targetContainerId = 'viewSuttaPanel') {
    const container = document.getElementById(targetContainerId);
    if (!container || !suttaData) return;

    window.AppState.currentSutta = suttaData;
    window.AppState.activeExampleIndex = window.AppState.activeExampleIndex || 0;

    const examples = suttaData.examples || [];
    if (window.AppState.activeExampleIndex >= examples.length) {
        window.AppState.activeExampleIndex = 0;
    }
    const activeIndex = window.AppState.activeExampleIndex;
    const currentExample = examples[activeIndex] || null;

    container.innerHTML = `
        <!-- 01. සූත්‍ර Top Banner: ශීර්ෂය යටින් සෘජුවම වෘත්තිය සහ සන්නය -->
        <div class="panel-card pakati-banner-card">
            <div class="tag-row" style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem;">
                <span class="pakati-category-badge">පකති සන්ධි</span>
                <span class="badge badge-khanda">සන්ධිකණ්ඩ</span>
                ${suttaData.sutta_type ? `<span class="badge" style="background:#ECFDF5; color:#065F46; border:1px solid #A7F3D0;">${suttaData.sutta_type}</span>` : ''}
            </div>
            
            <h2 class="pakati-sutta-title">${suttaData.sutta_name || suttaData.sutta}</h2>

            <!-- සූත්‍රයේ තේරුම -->
            ${suttaData.sutta_meaning ? `
                <div class="pakati-meaning-container">
                    <p class="pakati-meaning-text">${parsePakatiMarkdownBold(suttaData.sutta_meaning)}</p>
                </div>
            ` : ''}

            <!-- වෘත්තිය සහ පදයෙන් පද සන්නය -->
            ${(suttaData.vutti || suttaData.vutti_sanna) ? `
                <div class="pakati-vutti-container">
                    ${suttaData.vutti ? `
                        <span class="vutti-label">සූත්‍ර වෘත්තිය (පාළි):</span>
                        <p class="pakati-vutti-text">${suttaData.vutti}</p>
                    ` : ''}
                    
                    ${suttaData.vutti && suttaData.vutti_sanna ? `<hr class="pakati-sanna-divider">` : ''}
                    
                    ${suttaData.vutti_sanna ? `
                        <span class="vutti-label">වෘත්තියේ පදයෙන් පද සන්නය:</span>
                        <p class="pakati-sanna-text">${parsePakatiMarkdownBold(suttaData.vutti_sanna)}</p>
                    ` : ''}
                </div>
            ` : ''}
        </div>

        <!-- 02. ෂඩාකාර විමර්ශනය (Text-Justified) -->
        ${suttaData.shadakara ? `
            <div class="panel-card">
                <h3 class="section-heading"><span class="heading-icon">⚜️</span> සූත්‍ර ෂඩාකාර විමර්ශනය</h3>
                <div class="shadakara-dynamic-grid">
                    ${renderPakatiShadakaraCards(suttaData.shadakara)}
                </div>
            </div>
        ` : ''}

        <!-- 02b. සන්නය (සන්න, ටීකා හා න්‍යාස විවරණ) — ෂඩාකාරයට පහළින්, විවෘතව -->
        ${suttaData.extended_commentary ? `
            <div class="panel-card sara-rupa-sanna-card">
                <h3 class="section-heading"><span class="heading-icon">📖</span> සන්නය <span class="kk-tika-hint">(සන්න, ටීකා හා න්‍යාස විවරණ)</span></h3>
                <div class="nama-commentary-text sanna-commentary-box">${suttaData.extended_commentary}</div>
            </div>
        ` : ''}


        <!-- 03. සූත්‍රයෙන් සෑදෙන සියලු පද (Compact Horizontal Wrapping Badges) -->
        ${renderPakatiFormedWords(suttaData.formed_words)}

        <!-- 04. සෑදිය නොහැකි පද / ප්‍රත්‍යුදාහරණ (Counter Examples) -->
        ${suttaData.counter_examples ? `
            <div class="panel-card pakati-counter-card">
                <h3 class="section-heading"><span class="heading-icon">🚫</span> සෑදිය නොහැකි පද / නීතිය නොවළඳින තැන් (ප්‍රත්‍යුදාහරණ)</h3>
                <div class="pakati-counter-content">
                    ${Array.isArray(suttaData.counter_examples) 
                        ? suttaData.counter_examples.map(ce => `<div class="counter-line">✖ ${ce}</div>`).join('') 
                        : `<div class="counter-line">✖ ${suttaData.counter_examples}</div>`}
                </div>
            </div>
        ` : ''}


        <!-- 06. පියවරෙන් පියවර පද සාධන පුවරුව -->
        ${examples.length > 0 ? `
            <div class="panel-card pakati-derivation-card">
                <h3 class="section-heading"><span class="heading-icon">⚙️</span> පියවරෙන් පියවර පද සාධන විධික්‍රමය</h3>
                
                <!-- උදාහරණ තේරීමේ Tabs -->
                <div class="example-tabs-list">
                    ${examples.map((ex, idx) => `
                        <button type="button" 
                                class="example-tab-btn ${idx === activeIndex ? 'active' : ''}" 
                                onclick="switchPakatiExample(${idx})">
                            ${ex.word || `උදාහරණය ${idx + 1}`}
                        </button>
                    `).join('')}
                </div>

                <!-- සාධන පියවර වගුව රඳවන Container එක -->
                <div id="pakatiDerivationContainer">
                    ${currentExample ? renderPakatiDerivationTable(currentExample) : ''}
                </div>
            </div>
        ` : ''}
    `;
}

// DOM-Direct Switch
function switchPakatiExample(index) {
    if (!window.AppState) window.AppState = {};
    window.AppState.activeExampleIndex = index;

    const currentSutta = window.AppState.currentSutta;
    if (!currentSutta || !currentSutta.examples) return;

    const buttons = document.querySelectorAll('.pakati-derivation-card .example-tab-btn');
    buttons.forEach((btn, idx) => {
        if (idx === index) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const derivationContainer = document.getElementById('pakatiDerivationContainer');
    if (derivationContainer) {
        const example = currentSutta.examples[index];
        derivationContainer.innerHTML = renderPakatiDerivationTable(example);
    } else {
        renderPakatiWorkspace(currentSutta);
    }
}