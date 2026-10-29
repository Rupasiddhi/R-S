/**
 * ==========================================================================
 * සංඥා සූත්‍ර Rendering Controller (js/sanna-view.js)
 * ==========================================================================
 */

// Global state එකක් නැතිනම් initialize කරගැනීම
window.AppState = window.AppState || {};

// Markdown bold (**...**) HTML <strong> බවට හරවන Helper ශ්‍රිතය (පාලි වචන පමණි)
function parseSannaMarkdownBold(text) {
    if (!text) return '';
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// ලෝපය, ආදේශ සහ ඊතල හැඩගැස්වීම
function formatSannaFormula(text) {
    if (!text) return '';
    let formatted = text.replace(/~([^~]+)~/g, '<span class="lopa-cut">$1</span>');
    formatted = formatted.replace(/([^\s~→\-+()<>]+)→([^\s~→\-+()<>]+)/g, function (m, a, b) { return '<span class="sub-ul">' + a + '<span style="color: var(--theme-accent); font-weight: bold; margin: 0 2px;">➔</span>' + b + '</span>'; });
    formatted = formatted.replace(/→/g, '<span style="color: var(--theme-accent); font-weight: bold; margin: 0 4px;">➔</span>');
    formatted = formatted.replace(/\[(.*?)\]/g, '<span style="background: var(--theme-tint); border: 1px solid var(--border-soft); padding: 1px 6px; border-radius: 4px; color: var(--theme-primary); font-weight: 700;">$1</span>');
    return formatted;
}

// ෂඩාකාර කාඩ්පත් Helper
function renderSannaShadakaraCards(shadakara) {
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

// අක්ෂර 41 සටහන (සූත්‍ර 2)
function renderSannaAkkharaChart(chart) {
    if (!chart) return '';
    const badges = (letters, cls = '') =>
        `<div class="sanna-badges-wrapper">${letters.map(l => `<span class="sanna-letter-badge ${cls}">${l}</span>`).join('')}</div>`;

    return `
        <div class="panel-card sanna-akkhara-card">
            <h3 class="section-heading"><span class="heading-icon">🔤</span> අක්ෂර එකචත්තාළීසය (41)</h3>
            ${chart.sara ? `<div class="sanna-group-header">⚜️ ස්වර (8)</div>${badges(chart.sara, 'sara')}` : ''}
            ${(chart.vagga || []).map(v => `<div class="sanna-group-header">⚜️ ${v.name}</div>${badges(v.letters)}`).join('')}
            ${chart.avagga ? `<div class="sanna-group-header">⚜️ අවර්ග (7)</div>${badges(chart.avagga)}` : ''}
            ${chart.niggahita ? `<div class="sanna-group-header">⚜️ නිග්ගහීත (1)</div>${badges(chart.niggahita, 'niggahita')}` : ''}
        </div>
    `;
}

// ස්ථාන විවරණ වගුව (සූත්‍ර 2)
function renderSannaPhonetics(phonetics) {
    if (!phonetics || !phonetics.sthana_classification) return '';
    return `
        <div class="panel-card sanna-phonetics-card">
            <h3 class="section-heading"><span class="heading-icon">🗣️</span> ස්ථාන-කරණ-ප්‍රයත්න විවරණය</h3>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr><th>ස්ථානය</th><th>එහි උපදනා අක්ෂර</th></tr>
                    </thead>
                    <tbody>
                        ${phonetics.sthana_classification.map(row => `
                            <tr>
                                <td>${row.sthana}</td>
                                <td><code class="pali-script-inline">${row.letters}</code></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// පරසංඥා නීති Grid (සූත්‍ර 11)
function renderSannaRules(rules) {
    if (!rules || rules.length === 0) return '';
    return `
        <div class="panel-card">
            <h3 class="section-heading"><span class="heading-icon">📜</span> පරසමඤ්ඤා (අන්‍ය ව්‍යාකරණ සංඥා)</h3>
            <div class="sanna-rules-grid">
                ${rules.map(r => `
                    <div class="sanna-rule-card">
                        <strong>${r.num}. ${r.rule}</strong>
                        <p>${r.content}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// පද සාධන වගු Helper
function renderSannaDerivationTable(example) {
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
                            <td style="font-size: 1.05rem; font-weight: 600;">${formatSannaFormula(st.formula || st.action)}</td>
                            <td><span class="rule-badge">${st.rule || '-'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="sanna-siddha-box">
            <span class="sanna-result-label">සිද්ධ රූපය (අවසන් ඵලය):</span>
            <span class="sanna-result-word">${example.final_result || example.word}</span>
        </div>
    `;
}

// ප්‍රධාන Workspace Rendering Function
function renderSannaWorkspace(suttaData, targetContainerId = 'viewSuttaPanel') {
    const container = document.getElementById(targetContainerId);
    if (!container || !suttaData) return;

    // සූත්‍රය සහ Active Index එක State එකට save කිරීම
    if (window.AppState.currentSutta !== suttaData) {
        window.AppState.activeExampleIndex = 0;
    }
    window.AppState.currentSutta = suttaData;
    window.AppState.currentTargetId = targetContainerId;

    const examples = suttaData.examples || [];
    if (!window.AppState.activeExampleIndex || window.AppState.activeExampleIndex >= examples.length) {
        window.AppState.activeExampleIndex = 0;
    }
    const activeIndex = window.AppState.activeExampleIndex;
    const currentExample = examples[activeIndex] || null;

    container.innerHTML = `
        <!-- 01. සූත්‍ර Top Banner -->
        <div class="panel-card sanna-banner-card">
            <div class="tag-row" style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap;">
                <span class="sanna-category-badge">සංඥා සූත්‍ර</span>
                <span class="badge badge-khanda">සන්ධිකණ්ඩ</span>
                ${suttaData.sutta_type ? `<span class="badge" style="background:var(--theme-tint); color:var(--theme-primary); border:1px solid var(--border-soft);">${suttaData.sutta_type}</span>` : ''}
            </div>

            <h2 class="sanna-sutta-title">${suttaData.sutta_name || suttaData.sutta}</h2>

            <!-- සූත්‍රයේ තේරුම -->
            ${suttaData.sutta_meaning ? `
                <div class="sanna-meaning-box">
                    <span class="vutti-label">සූත්‍රයේ තේරුම:</span>
                    <p class="sanna-meaning-text">${parseSannaMarkdownBold(suttaData.sutta_meaning)}</p>
                </div>
            ` : ''}

            <!-- වෘත්තිය සහ පදයෙන් පද සන්නය -->
            ${(suttaData.vutti || suttaData.vutti_sanna) ? `
                <div class="sanna-vutti-box">
                    ${suttaData.vutti ? `
                        <span class="vutti-label">සූත්‍ර වෘත්තිය (පාළි):</span>
                        <p class="sanna-vutti-text">${suttaData.vutti}</p>
                    ` : ''}

                    ${suttaData.vutti && suttaData.vutti_sanna ? `<hr class="sanna-sanna-divider">` : ''}

                    ${suttaData.vutti_sanna ? `
                        <span class="vutti-label">වෘත්තියේ පදයෙන් පද සන්නය:</span>
                        <div class="sanna-vutti-sanna-box">
                            <p class="sanna-sanna-text">${parseSannaMarkdownBold(suttaData.vutti_sanna)}</p>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
        </div>

        <!-- 02. ෂඩාකාර විමර්ශනය -->
        ${suttaData.shadakara ? `
            <div class="panel-card">
                <h3 class="section-heading"><span class="heading-icon">⚜️</span> සූත්‍ර ෂඩාකාර විමර්ශනය</h3>
                <div class="shadakara-dynamic-grid">
                    ${renderSannaShadakaraCards(suttaData.shadakara)}
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


        <!-- 03. අක්ෂර සටහන / ස්ථාන වගුව / පරසංඥා -->
        ${renderSannaAkkharaChart(suttaData.akkhara_chart)}
        ${renderSannaPhonetics(suttaData.phonetics_system)}
        ${renderSannaRules(suttaData.twenty_one_rules)}


        <!-- 05. පියවරෙන් පියවර පද සාධන පුවරුව -->
        ${examples.length > 0 ? `
            <div class="panel-card sanna-derivation-card">
                <h3 class="section-heading"><span class="heading-icon">⚙️</span> පියවරෙන් පියවර පද සාධන විධික්‍රමය</h3>

                <div class="example-tabs-list sanna-example-tabs">
                    ${examples.map((ex, idx) => `
                        <button type="button"
                                class="example-tab-btn ${idx === activeIndex ? 'active' : ''}"
                                onclick="switchSannaExample(${idx})">
                            ${ex.word || `උදාහරණය ${idx + 1}`}
                        </button>
                    `).join('')}
                </div>

                <div id="sannaDerivationContainer">
                    ${currentExample ? renderSannaDerivationTable(currentExample) : ''}
                </div>
            </div>
        ` : ''}
    `;
}

// උදාහරණ Tab ක්ලික් කළ විට (DOM-Direct Switch - පිටුව reload නොවේ)
function switchSannaExample(index) {
    if (!window.AppState) window.AppState = {};
    window.AppState.activeExampleIndex = index;

    const currentSutta = window.AppState.currentSutta;
    if (!currentSutta || !currentSutta.examples) return;

    // 1. Tab buttons වල active class එක මාරු කිරීම
    document.querySelectorAll('.sanna-example-tabs .example-tab-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === index);
    });

    // 2. සාධන වගුව පමණක් update කිරීම
    const derivationContainer = document.getElementById('sannaDerivationContainer');
    if (derivationContainer) {
        derivationContainer.innerHTML = renderSannaDerivationTable(currentSutta.examples[index]);
    } else {
        renderSannaWorkspace(currentSutta, window.AppState.currentTargetId || 'viewSuttaPanel');
    }
}