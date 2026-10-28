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
            { id: "05_pakati", name: "පකති සන්ධි" },
            { id: "03_byanjana", name: "ව්‍යංජන සන්ධි" },
            { id: "04_niggahita", name: "නිග්ගහීත සන්ධි" }
        ]
    },
    {
        key: "2_nama",
        name: "2. නාමකණ්ඩ",
        subCategories: [
            { id: "01_pullinga", name: "පුල්ලිඞ්ගං" },
            { id: "01b_pullinga_sadhana", name: "පුල්ලිඞ්ග පද සාධනය" },
            { id: "02_itthilinga", name: "ඉත්ථිලිඞ්ගං" },
            { id: "02b_itthilinga_sadhana", name: "ඉත්ථිලිඞ්ග පද සාධනය" },
            { id: "03_napumsakalinga", name: "නපුංසකලිඞ්ගං" },
            { id: "03b_napumsakalinga_sadhana", name: "නපුංසකලිඞ්ග පද සාධනය" },
            { id: "04_sabbanama", name: "සබ්බනාමං" },
            { id: "04b_sabbanama_sadhana", name: "සබ්බනාම පද සාධනය" },
            { id: "05_alinga", name: "අලිඞ්ගනාමං (තුම්හ-අම්හ, සඞ්ඛ්‍යා)" },
            { id: "05b_alinga_sadhana", name: "අලිඞ්ගනාම පද සාධනය" },
            { id: "06_vibhattippaccaya", name: "විභත්තිප්පච්චයවිධානං" },
            { id: "07_abyaya", name: "අබ්‍යයපදං (උපසග්ග-නිපාත)" }
        ]
    },
    {
        key: "3_karaka",
        name: "3. කාරකකණ්ඩ",
        subCategories: [
            { id: "00_karaka_intro", name: "කාරක හැඳින්වීම" },
            { id: "01_karaka_pathama", name: "පඨමා — ලිඞ්ගත්ථ" },
            { id: "02_karaka_dutiya", name: "දුතියා — කම්මකාරක" },
            { id: "03_karaka_tatiya", name: "තතියා — කරණ, කත්තු, හෙතු" },
            { id: "04_karaka_catutthi", name: "චතුත්ථී — සම්පදානකාරක" },
            { id: "05_karaka_pancami", name: "පඤ්චමී — අපාදානකාරක" },
            { id: "06_karaka_chatthi", name: "ඡට්ඨී — සාමිසම්බන්ධ" },
            { id: "07_karaka_sattami", name: "සත්තමී — ඔකාසකාරක" }
        ]
    },
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

// PWA Deferred Prompt
let deferredPrompt = null;

// ස්ථාපිත ඇප් එකක් ලෙස (හෝ කලින් ස්ථාපනය කර) තිබේදැයි පරීක්ෂාව
function isAppInstalled() {
    try {
        if (window.matchMedia('(display-mode: standalone)').matches) return true;
        if (window.navigator.standalone === true) return true;
        if (localStorage.getItem('rsInstalled') === '1') return true;
    } catch (e) {}
    return false;
}

function setInstallButtonVisible(visible) {
    const btn = document.getElementById('btnInstallApp');
    if (btn) btn.style.display = visible ? 'inline-flex' : 'none';
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // නැවත ස්ථාපනය කළ හැකි බව බ්‍රවුසරය පෙන්වන විට කලින් සළකුණ ඉවත් කිරීම
    try { localStorage.removeItem('rsInstalled'); } catch (err) {}
    setInstallButtonVisible(true);
});

function showInstallHelp() {
    if (document.getElementById('installHelp')) return;
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const text = isIOS
        ? 'Safari හි පහළ ඇති බෙදාගන්න (Share) අයිකනය ඔබා "Add to Home Screen" තෝරන්න.'
        : 'බ්‍රවුසරයේ මෙනුව (⋮) විවෘත කර "Install app" හෝ "Add to Home screen" තෝරන්න.';
    const wrap = document.createElement('div');
    wrap.id = 'installHelp';
    wrap.className = 'install-help';
    wrap.innerHTML = `<div class="install-help-box" role="dialog"><h3>📲 යෙදුම ස්ථාපනය කරන්න</h3><p>${text}</p><button type="button">හරි</button></div>`;
    const close = () => wrap.remove();
    wrap.addEventListener('click', (ev) => { if (ev.target === wrap) close(); });
    wrap.querySelector('button').addEventListener('click', close);
    document.body.appendChild(wrap);
}

function parseLopaCuts(text) {
    if (!text) return '';
    return text.replace(/~([^~]+)~/g, '<span class="lopa-cut">$1</span>');
}

function switchTheme(themeKey) {
    document.body.setAttribute('data-theme', themeKey);
    // බ්‍රවුසරයේ / ඇප් එකේ ඉහළ තීරුවේ වර්ණයද මාරු කිරීම
    try {
        const c = getComputedStyle(document.body).getPropertyValue('--theme-primary').trim();
        const m = document.querySelector('meta[name="theme-color"]');
        if (c && m) m.setAttribute('content', c);
    } catch (e) {}
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
        const khandaNo = (item.name.match(/^\s*(\d+)\./) || [])[1] || '•';
        const khandaTitle = item.name.replace(/^\s*\d+\.\s*/, '');
        btn.innerHTML = `
            <span class="khanda-label"><span class="khanda-icon">${khandaNo}</span><span>${khandaTitle}</span></span>
            <span class="chevron-icon" style="font-size:0.75rem;">${isCurrentActive ? '▼' : '▶'}</span>
        `;
        
        btn.onclick = (e) => {
            e.stopPropagation();
            selectKhanda(item.key);
        };

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
            <span>${sub.name}</span>
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
            if (typeof isPadaSadhanaSubKhanda === 'function' && isPadaSadhanaSubKhanda(sub.id)) {
                renderSadhanaGroupedList(suttaListUl, sub.id, suttasForSub);
            } else suttasForSub.forEach(sutta => {
                const li = document.createElement('li');
                const sNumber = sutta.sutta_number !== undefined ? sutta.sutta_number : sutta.id;
                const isSelected = (String(sNumber) === String(AppState.activeSuttaNumber));
                li.className = `sutta-sub-item ${isSelected ? 'active' : ''}`;
                
                let displayName = sutta.sutta_name || sutta.sutta || '';
                if (displayName.includes('. ')) {
                    displayName = displayName.split('. ')[1];
                }

                li.innerHTML = sutta.is_intro ? `🧭 ${sutta.sutta_name}` : `<strong>${sNumber}.</strong> ${displayName}`;
                li.onclick = (e) => {
                    e.stopPropagation();
                    selectSuttaItem(sNumber, sub.id);
                    hideSidebarMenu();
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
 * පද සාධන ලැයිස්තුව: ලිඞ්ගය (අනුඛාණ්ඩය) > අන්ත වර්ගය (අකාරාන්ත ආදිය) > පද ලැයිස්තුව
 * පදයක් ක්ලික් කළ විට එහි පද සාධනය පෙන්වයි.
 */
function sadhanaGroupKey(subId, item) {
    const w = item.word || '';
    if (subId === '04b_sabbanama_sadhana') {
        if (w === 'කා') return 'කිං';
        return (w.length > 1 && w.endsWith('ා')) ? w.slice(0, -1) : w;
    }
    const e = (item.ending || '').trim();
    return e.split(/[\s(→]/)[0] || 'වෙනත්';
}
function renderSadhanaGroupedList(ul, subId, items) {
    const groups = [];
    const idx = {};
    items.forEach(it => {
        const k = sadhanaGroupKey(subId, it);
        if (!(k in idx)) { idx[k] = groups.length; groups.push({ key: k, items: [] }); }
        groups[idx[k]].items.push(it);
    });
    groups.forEach(g => {
        const hasActive = g.items.some(it => String(it.sutta_number) === String(AppState.activeSuttaNumber) && AppState.activeSubKhandaId === subId);
        const gli = document.createElement('li');
        gli.className = 'sadhana-group' + (hasActive ? ' open' : '');
        const head = document.createElement('button');
        head.type = 'button';
        head.className = 'sadhana-group-head';
        head.innerHTML = `<span>${g.key}</span><span class="sadhana-group-count">${g.items.length}</span><span class="sadhana-group-chev">${hasActive ? '▼' : '▶'}</span>`;
        head.onclick = (e) => {
            e.stopPropagation();
            const open = gli.classList.toggle('open');
            head.querySelector('.sadhana-group-chev').innerText = open ? '▼' : '▶';
        };
        const inner = document.createElement('ul');
        inner.className = 'sadhana-word-list';
        g.items.forEach(it => {
            const li = document.createElement('li');
            const n = it.sutta_number;
            const isSel = hasActive && String(n) === String(AppState.activeSuttaNumber);
            li.className = 'sutta-sub-item sadhana-word' + (isSel ? ' active' : '');
            li.dataset.sub = subId; li.dataset.num = n;
            const tag = (subId === '04b_sabbanama_sadhana' && it.linga) ? ` <small>(${it.linga.split(' ')[0]})</small>` : '';
            const sd = it.source === 'saddaniti' ? ` <span class="sd-tag" title="සද්දනීති පදමාලාවෙන්">සද්</span>` : '';
            li.innerHTML = `${it.word}${tag}${sd}`;
            li.onclick = (e) => { e.stopPropagation(); selectSuttaItem(n, subId); hideSidebarMenu(); };
            inner.appendChild(li);
        });
        gli.appendChild(head); gli.appendChild(inner);
        ul.appendChild(gli);
    });
}

/**
 * අනුඛාණ්ඩයක් Toggle කිරීම (අනුඛාණ්ඩය ක්ලික් කළ විට පමණක් සූත්‍ර ලැයිස්තුව දිගහැරේ)
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

        // පළමු සූත්‍රය ස්වයංක්‍රීයව තෝරාගැනීම
        if (suttasForSub.length > 0) {
            const firstSuttaId = suttasForSub[0].sutta_number !== undefined ? suttasForSub[0].sutta_number : suttasForSub[0].id;
            selectSuttaItem(firstSuttaId, subId);
        }
    } else {
        AppState.activeSubKhandaId = null;
    }
}

/**
 * අනුඛාණ්ඩය නාමකණ්ඩයට අයත්දැයි පරීක්ෂා කිරීම
 */
function isNamaSubKhanda(subId) {
    const nama = KHANDAS_CONFIG.find(k => k.key === '2_nama');
    return !!(nama && nama.subCategories.some(s => s.id === subId));
}

/**
 * සූත්‍රයක් තේරූ පසු ඛාණ්ඩ ලයිස්තුව (sidebar) සැඟවීම
 */
function isDrawerMode() {
    try { return window.matchMedia('(max-width: 1024px)').matches; }
    catch (e) { return window.innerWidth <= 1024; }
}

function hideSidebarMenu() {
    const nav = document.querySelector('.sidebar-nav');
    const layout = document.querySelector('.layout-container');
    const overlay = document.getElementById('sidebarOverlay');
    if (nav) nav.classList.remove('drawer-open');
    if (overlay) overlay.classList.remove('active');
    if (!isDrawerMode() && layout) layout.classList.add('sidebar-hidden');
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

    // Sidebar active item class toggle
    document.querySelectorAll('.sutta-sub-item').forEach(el => {
        if (el.dataset && el.dataset.sub) {
            const on = (el.dataset.sub === subId && String(el.dataset.num) === String(suttaNum));
            el.classList.toggle('active', on);
            if (on) {
                const g = el.closest('.sadhana-group');
                if (g) { g.classList.add('open'); const c = g.querySelector('.sadhana-group-chev'); if (c) c.innerText = '▼'; }
            }
        } else {
            el.classList.toggle('active', el.innerText.trim().startsWith(`${suttaNum}.`));
        }
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
    } else if (typeof isKarakaSubKhanda === 'function' && isKarakaSubKhanda(subId) && typeof renderKarakaWorkspace === 'function') {
        renderKarakaWorkspace(sutta);
    } else if (typeof isPadaSadhanaSubKhanda === 'function' && isPadaSadhanaSubKhanda(subId) && typeof renderPadaSadhanaWorkspace === 'function') {
        renderPadaSadhanaWorkspace(sutta);
    } else if (isNamaSubKhanda(subId) && typeof renderNamaWorkspace === 'function') {
        renderNamaWorkspace(sutta);
    } else {
        renderSuttaWorkspace(sutta);
    }
}

/**
 * ප්‍රධාන ඛාණ්ඩයක් තෝරා ගැනීම
 * (මෙහිදී අනුඛාණ්ඩ ලැයිස්තුව පමණක් විවෘත වන අතර සූත්‍ර ලැයිස්තුව ඉබේ දිගහැරීම වළක්වා ඇත)
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
    AppState.activeSubKhandaId = null; // කිසිදු අනුඛාණ්ඩයක් ස්වයංක්‍රීයව තෝරා නොගනී
    AppState.activeExampleIndex = 0;

    switchTheme(`khanda-${khandaKey}`);

    const btnIntro = document.getElementById('btnShadakaraIntro');
    if (btnIntro) btnIntro.classList.remove('active');

    renderKhandaTreeNavigation();
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

/* ==========================================================================
 * සර්වත්‍ර සෙවුම (Global Search)
 * සියලු ඛාණ්ඩ හා අනුඛාණ්ඩවල සූත්‍ර, වෘත්ති, අර්ථ, උදාහරණ හා වරනැඟිලි රූප තුළ සොයයි.
 * ========================================================================== */

let SEARCH_INDEX = null;
let searchActiveIndex = -1;
let searchCurrentResults = [];

// සිංහල අකුරුවල ZWJ/ZWNJ වැනි නොපෙනෙන අක්ෂර ඉවත් කර සංසන්දනය සඳහා සකස් කිරීම
function normalizeSearchText(text) {
    return String(text || '')
        .normalize('NFC')
        .replace(/<[^>]*>/g, ' ')
        .replace(/[​-‍﻿]/g, '')
        .replace(/[*~\[\]]/g, '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function escapeHtml(text) {
    return String(text || '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

function buildSearchIndex() {
    const index = [];
    const db = window.SuttaDatabase || {};

    KHANDAS_CONFIG.forEach(khanda => {
        (khanda.subCategories || []).forEach(sub => {
            (db[sub.id] || []).forEach(sutta => {
                const num = sutta.sutta_number !== undefined ? sutta.sutta_number : sutta.id;
                const title = sutta.sutta_name || sutta.sutta || sutta.word || '';
                const fields = [];
                const add = (label, value) => {
                    if (!value) return;
                    const list = Array.isArray(value) ? value : [value];
                    list.forEach(v => {
                        if (typeof v === 'string' && v.trim()) {
                            fields.push({ label, raw: v, norm: normalizeSearchText(v) });
                        }
                    });
                };

                add('අර්ථය', sutta.sutta_meaning || sutta.meaning);
                add('වෘත්තිය', sutta.vutti);
                add('සන්නය', sutta.vutti_sanna);
                add('සූත්‍ර වර්ගය', sutta.sutta_type);
                add('සෑදෙන පද', sutta.formed_words);
                add('ප්‍රත්‍යුදාහරණ', sutta.counter_examples);
                add('සමාන පද', sutta.similar_words);
                (sutta.examples || []).forEach(ex => {
                    add('උදාහරණය', ex.word);
                    add('සිද්ධ පදය', ex.final_result);
                });
                (sutta.declension || []).forEach(row => {
                    add(`${row.vibhatti || 'වරනැඟිල්ල'}`, [].concat(row.eka || [], row.bahu || []));
                });
                (sutta.derivations || []).forEach(d => add('පද සාධනය', d.word));

                index.push({
                    khandaKey: khanda.key,
                    khandaName: khanda.name,
                    subId: sub.id,
                    subName: sub.name,
                    num,
                    title,
                    titleNorm: normalizeSearchText(title),
                    fields
                });
            });
        });
    });

    return index;
}

function runGlobalSearch(query) {
    if (!SEARCH_INDEX) SEARCH_INDEX = buildSearchIndex();
    const q = normalizeSearchText(query);
    if (!q) return [];

    const terms = q.split(' ');
    const results = [];

    SEARCH_INDEX.forEach(entry => {
        const allText = entry.titleNorm + ' ' + entry.fields.map(f => f.norm).join(' ');
        if (!terms.every(t => allText.includes(t))) return;

        let score = 0;
        if (String(entry.num) === q) score += 100;
        if (entry.titleNorm.includes(q)) score += 50;
        if (terms.every(t => entry.titleNorm.includes(t))) score += 20;

        // කුමන ක්ෂේත්‍රයේ ගැළපුණේද යන්න පෙන්වීමට කෙටි කොටසක් (මුල් පාඨයෙන්, ZWJ රැකගෙන)
        let snippet = null;
        if (!entry.titleNorm.includes(terms[0])) {
            const field = entry.fields.find(f => f.norm.includes(terms[0]));
            if (field) {
                const display = cleanDisplayText(field.raw);
                const m = termRegex(terms[0]).exec(display);
                if (m) {
                    let start = Math.max(0, m.index - 30);
                    if (start > 0) {
                        // වචනයක් මැදින් කැපීම වැළැක්වීම
                        const space = display.indexOf(' ', start);
                        start = (space !== -1 && space < m.index) ? space + 1 : m.index;
                    }
                    const end = Math.min(display.length, m.index + m[0].length + 50);
                    snippet = { label: field.label, text: (start > 0 ? '…' : '') + display.slice(start, end) + (end < display.length ? '…' : '') };
                } else {
                    snippet = { label: field.label, text: display.slice(0, 80) };
                }
                if (field.label === 'උදාහරණය' || field.label === 'සිද්ධ පදය' || field.label === 'පද සාධනය') score += 10;
            }
        }

        results.push({ entry, score, snippet });
    });

    results.sort((a, b) => b.score - a.score);
    return results;
}

// පෙන්වීම සඳහා: HTML/markdown සලකුණු ඉවත් කරයි, නමුත් ZWJ (්‍ර, ්‍ය) රැකගනී
function cleanDisplayText(text) {
    return String(text || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/[*~\[\]]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// අක්ෂර අතර නොපෙනෙන අක්ෂර (ZWJ/ZWNJ) තිබුණද ගැළපෙන regex එකක්
function termRegex(term) {
    const chars = Array.from(term).map(ch => ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return new RegExp(chars.join('[\\u200B-\\u200D\\uFEFF]*'), 'gi');
}

function highlightTerms(text, query) {
    const display = cleanDisplayText(text);
    const ranges = [];
    normalizeSearchText(query).split(' ').filter(Boolean).forEach(term => {
        const re = termRegex(term);
        let m;
        while ((m = re.exec(display)) !== null) {
            if (m[0].length === 0) { re.lastIndex++; continue; }
            ranges.push([m.index, m.index + m[0].length]);
        }
    });
    if (!ranges.length) return escapeHtml(display);

    ranges.sort((a, b) => a[0] - b[0]);
    let out = '', pos = 0;
    ranges.forEach(([a, b]) => {
        if (a < pos) a = pos;
        if (b <= a) return;
        out += escapeHtml(display.slice(pos, a)) + '<mark>' + escapeHtml(display.slice(a, b)) + '</mark>';
        pos = b;
    });
    return out + escapeHtml(display.slice(pos));
}

function renderSearchResults(query) {
    const box = document.getElementById('searchResults');
    if (!box) return;

    if (!normalizeSearchText(query)) {
        closeSearchResults();
        return;
    }

    const results = runGlobalSearch(query);
    searchCurrentResults = results.slice(0, 50);
    searchActiveIndex = searchCurrentResults.length ? 0 : -1;

    if (results.length === 0) {
        box.innerHTML = `<div class="search-empty">"${escapeHtml(query)}" සඳහා ප්‍රතිඵල හමු නොවීය.</div>`;
    } else {
        box.innerHTML = `
            <div class="search-count">ප්‍රතිඵල ${results.length}${results.length > searchCurrentResults.length ? ` (පළමු ${searchCurrentResults.length} පෙන්වයි)` : ''}</div>
            ${searchCurrentResults.map((r, i) => {
                const titleText = String(r.entry.title).replace(/^\s*[^\s.]+\.\s+/, '');
                return `
                <button type="button" class="search-result-item ${i === searchActiveIndex ? 'active' : ''}" role="option" data-idx="${i}">
                    <span class="sr-path">${escapeHtml(r.entry.khandaName)} › ${escapeHtml(r.entry.subName)}</span>
                    <span class="sr-title"><strong>${escapeHtml(r.entry.num)}.</strong> ${highlightTerms(titleText, query)}</span>
                    ${r.snippet ? `<span class="sr-snippet"><em>${escapeHtml(r.snippet.label)}:</em> ${highlightTerms(r.snippet.text, query)}</span>` : ''}
                </button>`;
            }).join('')}
        `;
        box.querySelectorAll('.search-result-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openSearchResult(Number(btn.dataset.idx));
            });
        });
    }

    box.classList.add('open');
}

function closeSearchResults() {
    const box = document.getElementById('searchResults');
    if (box) {
        box.classList.remove('open');
        box.innerHTML = '';
    }
    searchCurrentResults = [];
    searchActiveIndex = -1;
}

function moveSearchSelection(delta) {
    if (!searchCurrentResults.length) return;
    searchActiveIndex = (searchActiveIndex + delta + searchCurrentResults.length) % searchCurrentResults.length;
    document.querySelectorAll('#searchResults .search-result-item').forEach((el, i) => {
        el.classList.toggle('active', i === searchActiveIndex);
        if (i === searchActiveIndex) el.scrollIntoView({ block: 'nearest' });
    });
}

function openSearchResult(idx) {
    const result = searchCurrentResults[idx];
    if (!result) return;
    const { khandaKey, subId, num } = result.entry;

    closeSearchResults();
    const input = document.getElementById('globalSearchInput');
    if (input) input.blur();

    navigateToSutta(khandaKey, subId, num);
}

/**
 * ඕනෑම ඛාණ්ඩයක/අනුඛාණ්ඩයක සූත්‍රයකට සෘජුව යාම (සෙවුම් ප්‍රතිඵල සඳහා)
 */
function navigateToSutta(khandaKey, subId, suttaNum) {
    AppState.currentMode = 'khanda';
    AppState.activeKhandaKey = khandaKey;
    AppState.activeSubKhandaId = subId;
    AppState.currentSuttas = (window.SuttaDatabase && window.SuttaDatabase[subId]) || [];

    switchTheme(`khanda-${khandaKey}`);
    const btnIntro = document.getElementById('btnShadakaraIntro');
    if (btnIntro) btnIntro.classList.remove('active');

    renderKhandaTreeNavigation();
    selectSuttaItem(suttaNum, subId);
    hideSidebarMenu();

    const activeItem = document.querySelector('.sutta-sub-item.active');
    if (activeItem) activeItem.scrollIntoView({ block: 'nearest' });

    const viewport = document.getElementById('mainViewport');
    if (viewport) viewport.scrollTop = 0;
    window.scrollTo(0, 0);
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
        searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));
        searchInput.addEventListener('focus', (e) => {
            if (e.target.value.trim()) renderSearchResults(e.target.value);
        });
        searchInput.addEventListener('click', (e) => e.stopPropagation());
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                moveSearchSelection(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                moveSearchSelection(-1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (searchActiveIndex >= 0) openSearchResult(searchActiveIndex);
            } else if (e.key === 'Escape') {
                searchInput.value = '';
                closeSearchResults();
                searchInput.blur();
            }
        });
    }

    const searchResultsBox = document.getElementById('searchResults');
    if (searchResultsBox) {
        searchResultsBox.addEventListener('click', (e) => e.stopPropagation());
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
            if (isDrawerMode()) {
                // දුරකථන/tablet: desktop මාදිලියෙන් ඉතිරි වූ සැඟවීමේ සළකුණ ඉවත් කර drawer එක විවෘත කිරීම
                if (layoutContainer) layoutContainer.classList.remove('sidebar-hidden');
                const willOpen = sidebarNav ? !sidebarNav.classList.contains('drawer-open') : false;
                if (sidebarNav) sidebarNav.classList.toggle('drawer-open', willOpen);
                if (sidebarOverlay) sidebarOverlay.classList.toggle('active', willOpen);
            } else {
                if (sidebarNav) sidebarNav.classList.remove('drawer-open');
                if (sidebarOverlay) sidebarOverlay.classList.remove('active');
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

    // PWA Install Button Handler
    const btnInstallApp = document.getElementById('btnInstallApp');
    // ස්ථාපනය කර ඇත්නම් බොත්තම සැඟවීම; නැතිනම් සෑම විටම පෙන්වීම
    setInstallButtonVisible(!isAppInstalled());
    if (btnInstallApp) {
        btnInstallApp.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!deferredPrompt) { showInstallHelp(); return; }
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                try { localStorage.setItem('rsInstalled', '1'); } catch (err) {}
                setInstallButtonVisible(false);
            }
            deferredPrompt = null;
        });
    }

    window.addEventListener('appinstalled', () => {
        try { localStorage.setItem('rsInstalled', '1'); } catch (err) {}
        setInstallButtonVisible(false);
        deferredPrompt = null;
    });

    try {
        window.matchMedia('(display-mode: standalone)').addEventListener('change', (ev) => {
            if (ev.matches) setInstallButtonVisible(false);
        });
    } catch (e) {}

    // Sidebar එක ඇතුළත ක්ලික් වූ විට පිටත Click event එක trigger වීම වැළැක්වීම
    if (sidebarNav) {
        sidebarNav.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // සූත්‍රයක් තෝරාගෙන අවසන් වූ පසු පිටත (Viewport/Header) ටච් කළ විට මෙනුව වැසීම
    document.addEventListener('click', (e) => {
        // සෙවුම් ප්‍රතිඵල ලැයිස්තුවෙන් පිටත ක්ලික් කළ විට එය වැසීම
        const searchWrapper = document.querySelector('.search-box-wrapper');
        if (!(searchWrapper && searchWrapper.contains(e.target))) {
            closeSearchResults();
        }

        if (sidebarNav && sidebarNav.contains(e.target)) return;
        if (btnToggleSidebar && btnToggleSidebar.contains(e.target)) return;

        // Mobile / Tablet Drawer වැසීම
        if (sidebarNav && sidebarNav.classList.contains('drawer-open')) {
            sidebarNav.classList.remove('drawer-open');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }

        // Desktop Layout හිදී සයිඩ්බාර් එක Hide කර තිරය නිදහස් කිරීම
        if (!isDrawerMode()) {
            if (layoutContainer && !layoutContainer.classList.contains('sidebar-hidden')) {
                layoutContainer.classList.add('sidebar-hidden');
            }
        }
    });

    // තිරය කරකැවීමේදී / ප්‍රමාණය වෙනස් වීමේදී sidebar තත්ත්වය නිවැරදිව පවත්වා ගැනීම
    const syncSidebarMode = () => {
        if (isDrawerMode()) {
            if (layoutContainer) layoutContainer.classList.remove('sidebar-hidden');
        } else {
            if (sidebarNav) sidebarNav.classList.remove('drawer-open');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }
    };
    window.addEventListener('resize', syncSidebarMode);
    window.addEventListener('orientationchange', syncSidebarMode);
    syncSidebarMode();

    showShadakaraIntro();
});