/**
 * ==========================================================================
 * පද රූපසිද්ධි සංහිතා - Core Controller Engine (js/app.js)
 * ==========================================================================
 */

// ඛාණ්ඩ 7 පිළිබඳ නාමාවලි සටහන
const KHANDAS_CONFIG = [
    { 
        key: "1_sandhi", 
        name: "1. සන්ධිකණ්ඩ",
        subCategories: [
            { id: "01_sanna", name: "සංඥා සූත්‍ර" },
            { id: "02_sara", name: "ස්වර සන්ධි" },
            { id: "03_byanjana", name: "ව්‍යංජන සන්ධි" },
            { id: "04_niggahita", name: "නිග්ගහීත සන්ධි" },
            { id: "05_pakati", name: "පකති සන්ධි" }
        ]
    },
    { key: "2_nama", name: "2. නාමකණ්ඩ", subCategories: [{ id: "01_pullinga", name: "පුල්ලිංග" }, { id: "02_itthilinga", name: "ඉත්ථිලිංග" }] },
    { key: "3_karaka", name: "3. කාරකකණ්ඩ", subCategories: [{ id: "01_karaka_general", name: "කාරක විධි" }] },
    { key: "4_samasa", name: "4. සමාසකණ්ඩ", subCategories: [{ id: "01_samasa_general", name: "සමාස විධි" }] },
    { key: "5_taddhita", name: "5. තද්ධිතකණ්ඩ", subCategories: [{ id: "01_taddhita_general", name: "තද්ධිත විධි" }] },
    { key: "6_akhyata", name: "6. ආඛ්‍යාතකණ්ඩ", subCategories: [{ id: "01_akhyata_general", name: "ආඛ්‍යාත විධි" }] },
    { key: "7_kibbhidhana", name: "7. කිබ්බිධානකණ්ඩ", subCategories: [{ id: "01_krt_general", name: "කිත් විධි" }] }
];

// Global App State
window.AppState = {
    currentMode: 'intro',
    activeKhandaKey: null,
    activeSubKhandaId: null,
    activeSuttaNumber: null,
    activeExampleIndex: 0,
    currentSuttas: [],
    currentSutta: null
};

// ➔ මෙතැනට එක් කරන්න:
let deferredPrompt = null;

// බ්‍රවුසරයේ පෙරනිමි prompt එක රඳවා තබාගැනීම
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btnInstallApp = document.getElementById('btnInstallApp');
    if (btnInstallApp) {
        btnInstallApp.style.display = 'inline-flex';
    }
});

function parseLopaCuts(text) {
    if (!text) return '';
    return text.replace(/~([^~]+)~/g, '<span class="lopa-cut">$1</span>');
}

function switchTheme(themeKey) {
    document.body.setAttribute('data-theme', themeKey);
}

/**
 * Tree View Navigation Render කිරීම
 */
function renderKhandaTreeNavigation() {
    const nav = document.getElementById('khandaListNav');
    if (!nav) return;
    nav.innerHTML = '';

    KHANDAS_CONFIG.forEach(item => {
        const node = document.createElement('div');
        node.className = 'khanda-node';

        const isCurrentActive = (item.key === AppState.activeKhandaKey && AppState.currentMode === 'khanda');

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `khanda-tab ${isCurrentActive ? 'active' : ''}`;
        btn.setAttribute('data-khanda', item.key);
        btn.innerHTML = `
            <span>📄 ${item.name}</span>
            <span class="chevron-icon" style="font-size:0.75rem;">${isCurrentActive ? '▼' : '▶'}</span>
        `;
        
        btn.onclick = () => selectKhanda(item.key);

        const subContainer = document.createElement('div');
        subContainer.id = `subContainer_${item.key}`;
        subContainer.className = `subkhanda-tree-container ${isCurrentActive ? 'expanded' : ''}`;

        node.appendChild(btn);
        node.appendChild(subContainer);
        nav.appendChild(node);

        if (isCurrentActive) {
            populateSubKhandaUnderButton(item.key, item.subCategories || []);
        }
    });
}

/**
 * අනුඛාණ්ඩ සහ සූත්‍ර ලැයිස්තු Populate කිරීම
 */
function populateSubKhandaUnderButton(khandaKey, subCategories) {
    const container = document.getElementById(`subContainer_${khandaKey}`);
    if (!container) return;
    container.innerHTML = '';

    subCategories.forEach(sub => {
        const subNode = document.createElement('div');
        subNode.className = 'subkhanda-node';

        const isCurrentSub = (AppState.activeSubKhandaId === sub.id && AppState.currentMode === 'khanda');

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `subkhanda-tree-btn ${isCurrentSub ? 'active' : ''}`;
        btn.innerHTML = `
            <span>▸ ${sub.name}</span>
            <span class="sub-chevron" style="font-size:0.7rem;">${isCurrentSub ? '▼' : '▶'}</span>
        `;
        
        btn.onclick = (e) => {
            e.stopPropagation();
            toggleSubKhandaSuttas(sub.id);
        };

        const suttaListUl = document.createElement('ul');
        suttaListUl.id = `suttaList_${sub.id}`;
        suttaListUl.className = `sutta-sub-list ${isCurrentSub ? 'expanded' : ''}`;

        const suttasForSub = (window.SuttaDatabase && window.SuttaDatabase[sub.id]) || [];

        if (suttasForSub.length === 0) {
            suttaListUl.innerHTML = `<li style="padding: 0.4rem; font-size: 0.8rem; color: var(--text-muted); font-style: italic;">සූත්‍ර ඇතුළත් කර නොමැත.</li>`;
        } else {
            suttasForSub.forEach(sutta => {
                const li = document.createElement('li');
                const sNumber = sutta.sutta_number !== undefined ? sutta.sutta_number : sutta.id;
                const isSelected = (String(sNumber) === String(AppState.activeSuttaNumber));
                li.className = `sutta-sub-item ${isSelected ? 'active' : ''}`;
                
                let displayName = sutta.sutta_name || sutta.sutta || '';
                if (displayName.includes('. ')) {
                    displayName = displayName.split('. ')[1];
                }

                li.innerHTML = `<strong>${sNumber}.</strong> ${displayName}`;
                li.onclick = (e) => {
                    e.stopPropagation();
                    selectSuttaItem(sNumber, sub.id);
                };
                suttaListUl.appendChild(li);
            });
        }

        subNode.appendChild(btn);
        subNode.appendChild(suttaListUl);
        container.appendChild(subNode);
    });
}

/**
 * අනුඛාණ්ඩයක් Toggle කිරීම
 */
function toggleSubKhandaSuttas(subId) {
    const isAlreadyActive = (AppState.activeSubKhandaId === subId);

    document.querySelectorAll('.sutta-sub-list').forEach(el => el.classList.remove('expanded'));
    document.querySelectorAll('.subkhanda-tree-btn').forEach(el => {
        el.classList.remove('active');
        const chevron = el.querySelector('.sub-chevron');
        if (chevron) chevron.innerText = '▶';
    });

    if (!isAlreadyActive) {
        AppState.activeSubKhandaId = subId;
        const targetUl = document.getElementById(`suttaList_${subId}`);
        if (targetUl) {
            targetUl.classList.add('expanded');
            const currentSubBtn = targetUl.previousElementSibling;
            if (currentSubBtn) {
                currentSubBtn.classList.add('active');
                const chevron = currentSubBtn.querySelector('.sub-chevron');
                if (chevron) chevron.innerText = '▼';
            }
        }

        const suttasForSub = (window.SuttaDatabase && window.SuttaDatabase[subId]) || [];
        AppState.currentSuttas = suttasForSub;

        if (suttasForSub.length > 0) {
            const firstSuttaId = suttasForSub[0].sutta_number !== undefined ? suttasForSub[0].sutta_number : suttasForSub[0].id;
            selectSuttaItem(firstSuttaId, subId);
        }
    } else {
        AppState.activeSubKhandaId = null;
    }
}

/**
 * සූත්‍රයක් තෝරා ගැනීම සහ අදාළ Renderer එක කැඳවීම
 */
function selectSuttaItem(suttaNum, subId) {
    AppState.activeSuttaNumber = suttaNum;
    AppState.activeSubKhandaId = subId;
    AppState.activeExampleIndex = 0;

    // View Panels පාලනය
    const introPanel = document.getElementById('viewIntroPanel');
    const suttaPanel = document.getElementById('viewSuttaPanel');
    if (introPanel) introPanel.style.display = 'none';
    if (suttaPanel) suttaPanel.style.display = 'flex';

    // ජංගම දුරකථන තිරයකදී පමණක් (<= 768px) සූත්‍රයක් තෝරාගත් විට සයිඩ්බාර් එක වැසීම
    if (window.innerWidth <= 768) {
        const sidebarNav = document.querySelector('.sidebar-nav');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        if (sidebarNav) sidebarNav.classList.remove('drawer-open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    }

    // Sidebar active item class toggle
    document.querySelectorAll('.sutta-sub-item').forEach(el => {
        el.classList.toggle('active', el.innerText.trim().startsWith(`${suttaNum}.`));
    });

    const suttasForSub = (window.SuttaDatabase && window.SuttaDatabase[subId]) || [];
    const sutta = suttasForSub.find(s => {
        const num = s.sutta_number !== undefined ? s.sutta_number : s.id;
        return String(num) === String(suttaNum);
    });

    if (!sutta) return;

    AppState.currentSutta = sutta;

    // අනුඛාණ්ඩය අනුව අදාළ Renderer එක කැඳවීම
    if (subId === '01_sanna' && typeof renderSannaWorkspace === 'function') {
        renderSannaWorkspace(sutta);
    } else if (subId === '02_sara' && typeof renderSaraWorkspace === 'function') {
        renderSaraWorkspace(sutta);
    } else if (subId === '03_byanjana' && typeof renderByanjanaWorkspace === 'function') {
        renderByanjanaWorkspace(sutta);
    } else if (subId === '04_niggahita' && typeof renderNiggahitaWorkspace === 'function') {
        renderNiggahitaWorkspace(sutta);
    } else if (subId === '05_pakati' && typeof renderPakatiWorkspace === 'function') {
        renderPakatiWorkspace(sutta);
    } else {
        renderSuttaWorkspace(sutta);
    }
}

/**
 * ප්‍රධාන ඛාණ්ඩයක් තෝරා ගැනීම
 */
function selectKhanda(khandaKey) {
    if (AppState.currentMode === 'khanda' && AppState.activeKhandaKey === khandaKey) {
        AppState.currentMode = 'intro';
        AppState.activeKhandaKey = null;
        AppState.activeSubKhandaId = null;
        
        renderKhandaTreeNavigation();
        showShadakaraIntro();
        return;
    }

    AppState.currentMode = 'khanda';
    AppState.activeKhandaKey = khandaKey;
    AppState.activeExampleIndex = 0;

    switchTheme(`khanda-${khandaKey}`);

    const btnIntro = document.getElementById('btnShadakaraIntro');
    if (btnIntro) btnIntro.classList.remove('active');

    const introPanel = document.getElementById('viewIntroPanel');
    const suttaPanel = document.getElementById('viewSuttaPanel');
    if (introPanel) introPanel.style.display = 'none';
    if (suttaPanel) suttaPanel.style.display = 'flex';

    renderKhandaTreeNavigation();

    const currentKhandaConfig = KHANDAS_CONFIG.find(k => k.key === khandaKey);
    if (currentKhandaConfig && currentKhandaConfig.subCategories.length > 0) {
        toggleSubKhandaSuttas(currentKhandaConfig.subCategories[0].id);
    }
}

/**
 * 0. ෂඩාකාරය හැඳින්වීම පෙන්වීම
 */
function showShadakaraIntro() {
    AppState.currentMode = 'intro';
    AppState.activeKhandaKey = null;
    AppState.activeSubKhandaId = null;

    switchTheme('intro-shadakara');

    const btnIntro = document.getElementById('btnShadakaraIntro');
    if (btnIntro) btnIntro.classList.add('active');

    document.querySelectorAll('.subkhanda-tree-container').forEach(el => el.classList.remove('expanded'));
    document.querySelectorAll('.khanda-tab').forEach(el => el.classList.remove('active'));

    const introPanel = document.getElementById('viewIntroPanel');
    const suttaPanel = document.getElementById('viewSuttaPanel');
    if (introPanel) introPanel.style.display = 'flex';
    if (suttaPanel) suttaPanel.style.display = 'none';

    renderKhandaTreeNavigation();
    
    if (typeof renderShadakaraFullIntro === 'function') {
        renderShadakaraFullIntro();
    }
}

/**
 * පෙරනිමි සූත්‍ර වැඩබිම Render කිරීම
 */
function renderSuttaWorkspace(sutta) {
    const khandaConfig = KHANDAS_CONFIG.find(k => k.key === AppState.activeKhandaKey);
    const khandaBadge = document.getElementById('currentKhandaBadge');
    const subBadge = document.getElementById('currentSubKhandaBadge');
    const titleEl = document.getElementById('displaySuttaTitle');
    const vuttiEl = document.getElementById('displaySuttaVutti');

    if (khandaBadge) khandaBadge.innerText = khandaConfig ? khandaConfig.name : '--';
    if (subBadge) subBadge.innerText = sutta.sub_khanda_name || '--';
    if (titleEl) titleEl.innerText = sutta.sutta_name || sutta.sutta || '';
    if (vuttiEl) vuttiEl.innerText = sutta.vutti || '';

    const shad = sutta.shadakara || {};
    const shadGrid = document.getElementById('displayShadakaraGrid');

    if (shadGrid) {
        shadGrid.innerHTML = `
            <div class="shad-aspect-card">
                <div class="shad-card-header">
                    <span class="shad-number-badge">1</span>
                    <h4 class="shad-card-title">සම්බන්ධො</h4>
                </div>
                <div class="shad-lakkhana-box">${shad.sambandha_pali || "සුත්තෙ පුබ්බාපරපදානං එකවාක්‍යතාය යොජනා සම්බන්ධො"}</div>
                <p class="shad-card-desc">${shad.sambandha || "--"}</p>
            </div>
            <div class="shad-aspect-card">
                <div class="shad-card-header">
                    <span class="shad-number-badge">2</span>
                    <h4 class="shad-card-title">පදං</h4>
                </div>
                <div class="shad-lakkhana-box">${shad.pada_pali || "සුත්තෙ පදච්ඡෙදවසෙන පදං වෙදිතබ්බං"}</div>
                <p class="shad-card-desc">${shad.pada || "--"}</p>
            </div>
            <div class="shad-aspect-card">
                <div class="shad-card-header">
                    <span class="shad-number-badge">3</span>
                    <h4 class="shad-card-title">පදත්‍ථො</h4>
                </div>
                <div class="shad-lakkhana-box">${shad.padattha_pali || "සුත්තත්ථවසෙන පදත්‍ථො වෙදිතබ්බං"}</div>
                <p class="shad-card-desc">${shad.padattha || "--"}</p>
            </div>
            <div class="shad-aspect-card">
                <div class="shad-card-header">
                    <span class="shad-number-badge">4</span>
                    <h4 class="shad-card-title">පදවිග්ගහො</h4>
                </div>
                <div class="shad-lakkhana-box">${shad.padaviggaha_pali || "සුත්තෙ විජ්ජමානසමාස-තද්ධිත-කිතකපදානං විග්ගහදස්සනං"}</div>
                <p class="shad-card-desc">${shad.padaviggaha || "--"}</p>
            </div>
            <div class="shad-aspect-card">
                <div class="shad-card-header">
                    <span class="shad-number-badge">5</span>
                    <h4 class="shad-card-title">චොදනා</h4>
                </div>
                <div class="shad-lakkhana-box">${shad.chodana_pali || "සුත්තෙ පදානං පයොජනාදිපුච්ඡනං චොදනා"}</div>
                <p class="shad-card-desc">${shad.chodana || "--"}</p>
            </div>
            <div class="shad-aspect-card">
                <div class="shad-card-header">
                    <span class="shad-number-badge">6</span>
                    <h4 class="shad-card-title">පරිහාරො</h4>
                </div>
                <div class="shad-lakkhana-box">${shad.parihara_pali || "සුත්තෙ පදානං සාත්ථකතාදිදස්සනවසෙන පරිහරණං පරිහාරො"}</div>
                <p class="shad-card-desc">${shad.parihara || "--"}</p>
            </div>
        `;
    }

    renderExtraSuttaInformation(sutta);
    renderDerivationSection(sutta);
}

/**
 * සූත්‍රයේ අතිරේක ව්‍යාකරණ තොරතුරු හා අක්ෂර මාලාව පෙන්වීම
 */
function renderExtraSuttaInformation(sutta) {
    const extraContainer = document.getElementById('extraSuttaDetailsBlock');
    if (!extraContainer) return;

    let html = `
        <h3 class="section-heading">
            <span class="heading-icon">📚</span> සූත්‍ර විමර්ශන අතිරේක තොරතුරු
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
            ${sutta.sutta_type ? `
                <div style="background: #FAF8F5; border: 1px solid var(--border-soft); padding: 0.8rem; border-radius: 6px;">
                    <strong style="color: var(--theme-primary);">සූත්‍ර වර්ගය:</strong>
                    <div>${sutta.sutta_type}</div>
                </div>` : ''}
            ${sutta.pada_cheda ? `
                <div style="background: #FAF8F5; border: 1px solid var(--border-soft); padding: 0.8rem; border-radius: 6px;">
                    <strong style="color: var(--theme-primary);">පදච්ඡේදය:</strong>
                    <div>${sutta.pada_cheda}</div>
                </div>` : ''}
            ${sutta.anuvattana ? `
                <div style="background: #FAF8F5; border: 1px solid var(--border-soft); padding: 0.8rem; border-radius: 6px;">
                    <strong style="color: var(--theme-primary);">අනුවර්තනය:</strong>
                    <div>${sutta.anuvattana}</div>
                </div>` : ''}
        </div>
    `;

    extraContainer.innerHTML = html;
}

function renderDerivationSection(sutta) {
    const tabsContainer = document.getElementById('exampleTabsNav');
    const tbody = document.getElementById('derivationStepsBody');
    const finalBox = document.getElementById('displayFinalWord');

    if (!tabsContainer || !tbody || !finalBox) return;
    tabsContainer.innerHTML = '';

    if (!sutta.examples || sutta.examples.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted); font-style: italic; padding: 1.5rem;">මෙම සූත්‍රය සංඥා මාත්‍රයක් හෝ පදසාධන නිදසුන් රහිත සූත්‍රයකි.</td></tr>`;
        finalBox.innerText = '--';
        return;
    }

    sutta.examples.forEach((ex, idx) => {
        const btn = document.createElement('button');
        btn.className = `example-tab-btn ${idx === AppState.activeExampleIndex ? 'active' : ''}`;
        btn.innerText = ex.word;
        btn.onclick = () => {
            AppState.activeExampleIndex = idx;
            document.querySelectorAll('.example-tab-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
            renderDerivationTable(sutta.examples[idx]);
        };
        tabsContainer.appendChild(btn);
    });

    renderDerivationTable(sutta.examples[AppState.activeExampleIndex]);
}

function renderDerivationTable(exampleObj) {
    const tbody = document.getElementById('derivationStepsBody');
    const finalBox = document.getElementById('displayFinalWord');
    if (!tbody || !finalBox) return;

    tbody.innerHTML = (exampleObj.steps || []).map((st, i) => `
        <tr>
            <td style="font-weight: 700; color: var(--text-muted); width: 50px;">${i + 1}</td>
            <td style="font-weight: 600; font-size: 1.05rem;">${parseLopaCuts(st.formula || st.action)}</td>
            <td><span class="rule-badge">${st.rule || '-'}</span></td>
        </tr>
    `).join('');

    finalBox.innerText = exampleObj.final_result || exampleObj.word || '--';
}

function handleGlobalSearch(query) {
    const q = query.toLowerCase().trim();
    if (!q) return;

    const items = document.querySelectorAll('.sutta-sub-item');
    AppState.currentSuttas.forEach((s, idx) => {
        const name = (s.sutta_name || s.sutta || '').toLowerCase();
        const vutti = (s.vutti || '').toLowerCase();
        const matches = name.includes(q) || vutti.includes(q) ||
                        (s.examples && s.examples.some(e => (e.word || '').toLowerCase().includes(q)));
        if (items[idx]) {
            items[idx].style.display = matches ? 'block' : 'none';
        }
    });
}

// ආරම්භක Initialization
document.addEventListener('DOMContentLoaded', () => {

    const btnIntro = document.getElementById('btnShadakaraIntro');
    if (btnIntro) {
        btnIntro.addEventListener('click', (e) => {
            e.stopPropagation();
            showShadakaraIntro();
        });
    }

    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => handleGlobalSearch(e.target.value));
        searchInput.addEventListener('click', (e) => e.stopPropagation());
    }

    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (searchInput) searchInput.focus();
        }
    });

    const btnToggleSidebar = document.getElementById('btnToggleSidebar');
    const sidebarNav = document.querySelector('.sidebar-nav');
    const layoutContainer = document.querySelector('.layout-container');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (btnToggleSidebar) {
        btnToggleSidebar.addEventListener('click', (e) => {
            e.stopPropagation();
            // ජංගම දුරකථන තිර (<= 768px) සඳහා Drawer ආකාරයෙන් Toggle වීම
            if (window.innerWidth <= 768) {
                if (sidebarNav) sidebarNav.classList.toggle('drawer-open');
                if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
            } else {
                // Laptop සහ Tablet සඳහා සාමාන්‍ය Sidebar Hide/Show වීම පමණක් සිදුවේ
                if (layoutContainer) layoutContainer.classList.toggle('sidebar-hidden');
            }
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            if (sidebarNav) sidebarNav.classList.remove('drawer-open');
            sidebarOverlay.classList.remove('active');
        });
    }

    // ජංගම දුරකථන තිරයකදී පමණක් (<= 768px) පිටත ඕනෑම තැනක් ක්ලික් කළ විට Sidebar එක වැසීම
    document.addEventListener('click', (e) => {
        // Laptop සහ Tablet තිරවලදී (width > 768px) කිසිදු වෙනසක් සිදු නොවේ
        if (window.innerWidth > 768) return;

        // Toggle බොත්තම හෝ Sidebar එක ඇතුළත ක්ලික් වූ විට වැසීම වැළැක්වීම
        if (sidebarNav && sidebarNav.contains(e.target)) return;
        if (btnToggleSidebar && btnToggleSidebar.contains(e.target)) return;

        // Mobile Drawer එක පමණක් වැසීම
        if (sidebarNav && sidebarNav.classList.contains('drawer-open')) {
            sidebarNav.classList.remove('drawer-open');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }
    });

    // ➔ PWA Install Button Click Listener:
    const btnInstallApp = document.getElementById('btnInstallApp');
    if (btnInstallApp) {
        btnInstallApp.addEventListener('click', async () => {
            if (!deferredPrompt) return;

            // Prompt එක පෙන්වීම
            deferredPrompt.prompt();

            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('App එක ස්ථාපනය කරන ලදී.');
            }
            deferredPrompt = null;
            btnInstallApp.style.display = 'none';
        });
    }

    // Install වීම අවසන් වූ පසු බොත්තම සැඟවීම
    window.addEventListener('appinstalled', () => {
        if (btnInstallApp) {
            btnInstallApp.style.display = 'none';
        }
        deferredPrompt = null;
    });

    showShadakaraIntro();
});