// ==========================================================================
// පද රූපසිද්ධි සංහිතා - සැකසුම් (js/settings.js)
// Header දකුණු පස ඇති ⚙ බොත්තමෙන් විවෘත වන පැනලය:
//   • අකුරු ප්‍රමාණය  • පෙනුම (ස්වයංක්‍රීය / දිවා / රාත්‍රී)
//   • සැකසුම් යළි පිහිටුවීම  • යෙදුම යාවත්කාලීන කිරීම
// සැකසුම් localStorage හි ගබඩා වේ (නොමැති වුවද යෙදුම නිසි ලෙස ක්‍රියා කරයි).
// ==========================================================================

const RS_SETTINGS_KEY = 'rupasiddhi-settings';
const RS_APP_VERSION = 'v14.3.0';
const RS_FONT_MIN = 80;
const RS_FONT_MAX = 150;
const RS_FONT_STEP = 10;
const RS_DEFAULTS = { fontScale: 100, appearance: 'light' };

function rsLoadSettings() {
    try {
        const raw = localStorage.getItem(RS_SETTINGS_KEY);
        if (raw) return Object.assign({}, RS_DEFAULTS, JSON.parse(raw));
    } catch (e) { /* storage නොමැත */ }
    return Object.assign({}, RS_DEFAULTS);
}

function rsSaveSettings(s) {
    try { localStorage.setItem(RS_SETTINGS_KEY, JSON.stringify(s)); } catch (e) { /* නොසලකන්න */ }
}

const rsDarkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

function rsApplySettings(s) {
    const root = document.documentElement;
    root.style.fontSize = s.fontScale === 100 ? '' : (s.fontScale + '%');
    const night = s.appearance === 'dark' || (s.appearance === 'auto' && rsDarkQuery && rsDarkQuery.matches);
    root.classList.toggle('night-mode', !!night);
}

// පිටුව ඇඳීමට පෙර ම යෙදීම (සුදු "flash" එකක් නොවීමට)
let rsSettings = rsLoadSettings();
rsApplySettings(rsSettings);

function rsSyncPanel() {
    const out = document.getElementById('settingsFontValue');
    if (out) out.textContent = rsSettings.fontScale + '%';
    const dec = document.getElementById('settingsFontDec');
    const inc = document.getElementById('settingsFontInc');
    if (dec) dec.disabled = rsSettings.fontScale <= RS_FONT_MIN;
    if (inc) inc.disabled = rsSettings.fontScale >= RS_FONT_MAX;
    document.querySelectorAll('#settingsAppearance button').forEach(b => {
        b.setAttribute('aria-pressed', String(b.dataset.value === rsSettings.appearance));
    });
}

function rsUpdate(patch) {
    rsSettings = Object.assign({}, rsSettings, patch);
    rsSaveSettings(rsSettings);
    rsApplySettings(rsSettings);
    rsSyncPanel();
}

async function rsRefreshApp() {
    try {
        if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            await Promise.all(regs.map(r => r.update().catch(() => {})));
        }
        if (window.caches) {
            const keys = await caches.keys();
            await Promise.all(keys.filter(k => !k.includes('fonts')).map(k => caches.delete(k)));
        }
    } catch (e) { /* නොසලකන්න */ }
    location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnSettings');
    const panel = document.getElementById('settingsPanel');
    if (!btn || !panel) return;

    const open = (state) => {
        panel.classList.toggle('open', state);
        btn.setAttribute('aria-expanded', String(state));
    };

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        open(!panel.classList.contains('open'));
    });
    panel.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => open(false));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('open')) { open(false); btn.focus(); }
    });
    document.getElementById('settingsClose').addEventListener('click', () => open(false));

    document.getElementById('settingsFontDec').addEventListener('click', () =>
        rsUpdate({ fontScale: Math.max(RS_FONT_MIN, rsSettings.fontScale - RS_FONT_STEP) }));
    document.getElementById('settingsFontInc').addEventListener('click', () =>
        rsUpdate({ fontScale: Math.min(RS_FONT_MAX, rsSettings.fontScale + RS_FONT_STEP) }));

    document.querySelectorAll('#settingsAppearance button').forEach(b =>
        b.addEventListener('click', () => rsUpdate({ appearance: b.dataset.value })));

    document.getElementById('settingsReset').addEventListener('click', () => rsUpdate(Object.assign({}, RS_DEFAULTS)));
    document.getElementById('settingsRefresh').addEventListener('click', rsRefreshApp);

    const ver = document.getElementById('settingsVersion');
    if (ver) ver.textContent = 'රූපසිද්ධි සංහිතා ' + RS_APP_VERSION;

    if (rsDarkQuery && rsDarkQuery.addEventListener) {
        rsDarkQuery.addEventListener('change', () => rsApplySettings(rsSettings));
    }

    rsSyncPanel();
});
