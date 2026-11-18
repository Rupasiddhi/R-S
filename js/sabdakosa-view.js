/**
 * ==========================================================================
 * ශබ්දකෝෂය — ව්‍යාකරණ සද්දසින්ධු (js/sabdakosa-view.js)
 * --------------------------------------------------------------------------
 * මූලාශ්‍රය : විදුරුපොල පියතිස්ස මහානායක ස්ථවිරයන් වහන්සේගේ
 *             "ව්‍යාකරණසද්දසින්ධු" පාරිභාෂික ශබ්දකෝෂය (භාග 3)
 * දත්ත      : data/8_sabdakosa/sabdakosa_index.js  (පද නාමාවලිය — ආරම්භයේම පූරණය)
 *             data/8_sabdakosa/sk_NN.js            (අකුරකට එක් ගොනුව — අවශ්‍ය විටම පූරණය)
 *             data/8_sabdakosa/sabdakosa_front.js  (පෙරවදන, සංකේත, ශුද්ධිපත්‍රය)
 * ==========================================================================
 */

const KOSA_DIR = 'data/8_sabdakosa/';
const KOSA_LIST_LIMIT = 400;      // එක් වර පෙන්වන උපරිම පද ගණන
const KOSA_SEARCH_LIMIT = 120;    // සෙවුම් ප්‍රතිඵල උපරිමය

window.KosaState = {
    tab: 'words',       // 'words' | 'front'
    letter: null,
    group: null,
    letterIndex: null,  // තේරූ පදයේ අකුර
    wordIndex: null,    // එම අකුරේ ගොනුව තුළ පිහිටීම
    query: '',
    deep: false,        // විස්තර (අර්ථ විවරණ) තුළද සෙවීම
    deepLoading: false,
    limitShown: KOSA_LIST_LIMIT
};

/* ---------- සහායක ---------- */
function kosaEsc(t) {
    return typeof escapeHtml === 'function' ? escapeHtml(t)
        : String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function kosaNorm(t) {
    if (typeof normalizeSearchText === 'function') return normalizeSearchText(t);
    return String(t || '').normalize('NFC').replace(/<[^>]*>/g, ' ').replace(/[​-‍﻿]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}
function kosaPlain(html) {
    return String(html || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
function kosaHighlight(text, q) {
    if (!q) return kosaEsc(kosaPlain(text));
    if (typeof highlightTerms === 'function') return highlightTerms(text, q);
    return kosaEsc(kosaPlain(text));
}
// Roman අකුරින් ලියූ විට සිංහලට හැරවීම (search.js හි ක්‍රමයම)
function kosaQuery(raw) {
    if (typeof searchEffectiveQuery === 'function') return searchEffectiveQuery(raw);
    return { q: String(raw || '').trim(), converted: null };
}

/* ---------- දත්ත පූරණය ---------- */
const kosaLoaded = {};
function kosaLoadScript(file) {
    if (kosaLoaded[file]) return kosaLoaded[file];
    kosaLoaded[file] = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = KOSA_DIR + file;
        s.onload = () => resolve(true);
        s.onerror = () => { delete kosaLoaded[file]; reject(new Error(file)); };
        document.head.appendChild(s);
    });
    return kosaLoaded[file];
}
function kosaLetterMeta(letter) {
    const idx = window.SabdaKosaIndex;
    if (!idx) return null;
    return idx.letters.find(x => x.l === letter) || null;
}
function kosaLoadLetter(letter) {
    const meta = kosaLetterMeta(letter);
    if (!meta) return Promise.reject(new Error('අකුර නැත'));
    if (window.SabdaKosaData && window.SabdaKosaData[letter]) return Promise.resolve(true);
    return kosaLoadScript('sk_' + String(meta.f).padStart(2, '0') + '.js');
}
function kosaLoadAll() {
    const idx = window.SabdaKosaIndex;
    if (!idx) return Promise.resolve(false);
    return Promise.all(idx.letters.map(m => kosaLoadScript('sk_' + String(m.f).padStart(2, '0') + '.js')));
}
function kosaAllLoaded() {
    const idx = window.SabdaKosaIndex;
    if (!idx || !window.SabdaKosaData) return false;
    return idx.letters.every(m => !!window.SabdaKosaData[m.l]);
}
function kosaEntry(letter, i) {
    const arr = window.SabdaKosaData && window.SabdaKosaData[letter];
    return arr ? arr[i] : null;
}

/* ---------- සම්පූර්ණ පද අනුපිළිවෙළ (පෙර / ඊළඟ සඳහා) ---------- */
let KOSA_FLAT = null;
function kosaFlat() {
    if (KOSA_FLAT) return KOSA_FLAT;
    KOSA_FLAT = [];
    const idx = window.SabdaKosaIndex;
    if (!idx) return KOSA_FLAT;
    idx.letters.forEach(m => m.w.forEach((h, i) => KOSA_FLAT.push({ l: m.l, i, h, n: kosaNorm(h) })));
    return KOSA_FLAT;
}
function kosaFlatPos(letter, i) {
    return kosaFlat().findIndex(x => x.l === letter && x.i === i);
}

/* ---------- ප්‍රවිෂ්ට කොටස් HTML ---------- */
function kosaBlocksHtml(blocks, q) {
    let firstP = true;
    return (blocks || []).map(b => {
        const kind = b[0], raw = b[1];
        if (kind === 'tbl') return raw;
        const inner = q ? kosaHighlight(raw, q) : raw;
        if (kind === 'v') return '<p class="sk-v">' + inner + '</p>';
        if (kind === 'h') return '<p class="sk-h">' + inner + '</p>';
        const cls = firstP ? 'sk-p first' : 'sk-p';
        firstP = false;
        return '<p class="' + cls + '">' + inner + '</p>';
    }).join('');
}

/* ---------- මුහුණත ---------- */
function kosaRenderBanner() {
    const el = document.getElementById('kosaBanner');
    if (!el) return;
    const info = window.SabdaKosaInfo || {};
    const S = window.KosaState;
    el.innerHTML = `
        <span class="badge badge-khanda">📘 ශබ්දකෝෂය</span>
        <h2 class="kosa-title">${kosaEsc(info.title || 'ව්‍යාකරණ සද්දසින්ධු')}</h2>
        <p class="kosa-sub">${kosaEsc(info.subtitle || '')}</p>
        <div class="kosa-meta-row">
            ${info.author ? `<span class="kosa-chip-meta">✍️ ${kosaEsc(info.author)}</span>` : ''}
            ${info.count ? `<span class="kosa-chip-meta">📑 පාරිභාෂික පද ${Number(info.count).toLocaleString('en-US')}</span>` : ''}
            ${info.letterCount ? `<span class="kosa-chip-meta">🔤 අකුරු ${info.letterCount}</span>` : ''}
        </div>
        <div class="kosa-tabs">
            <button type="button" class="kosa-tab ${S.tab === 'words' ? 'active' : ''}" data-ktab="words">📑 පද ලැයිස්තුව</button>
            <button type="button" class="kosa-tab ${S.tab === 'front' ? 'active' : ''}" data-ktab="front">📖 පෙරවදන හා සංකේත</button>
        </div>`;
    el.querySelectorAll('[data-ktab]').forEach(b => b.onclick = () => {
        window.KosaState.tab = b.dataset.ktab;
        kosaRender();
    });
}

function kosaRenderBrowse() {
    const el = document.getElementById('kosaBrowse');
    if (!el) return;
    const S = window.KosaState;
    const idx = window.SabdaKosaIndex;
    if (!idx) { el.innerHTML = '<div class="kosa-loading">ශබ්දකෝෂ නාමාවලිය පූරණය වී නැත.</div>'; return; }

    const letters = idx.letters.map(m =>
        `<button type="button" class="kosa-letter ${m.l === S.letter && !S.query ? 'active' : ''}" data-kletter="${kosaEsc(m.l)}">${kosaEsc(m.l)}<small>${m.w.length}</small></button>`).join('');

    el.innerHTML = `
        <h3 class="section-heading"><span class="heading-icon">🔎</span> පදයක් සොයන්න</h3>
        <div class="kosa-search-wrap">
            <div class="kosa-search-box">
                <span class="kosa-s-icon">🔍</span>
                <input type="text" id="kosaSearchInput" placeholder="පදයක් ලියන්න (උදා: සන්ධි / sandhi)" autocomplete="off" value="${kosaEsc(S.query)}">
                ${S.query ? '<button type="button" class="kosa-s-clear" id="kosaSearchClear" aria-label="මකන්න">×</button>' : ''}
            </div>
            <button type="button" class="kosa-deep-btn ${S.deep ? 'on' : ''}" id="kosaDeepBtn" ${S.deepLoading ? 'disabled' : ''}>
                ${S.deepLoading ? '⏳ පූරණය වේ…' : (S.deep ? '📖 විස්තර තුළද සොයයි' : '📖 විස්තර තුළද සොයන්න')}
            </button>
            <div class="kosa-hint">අකුරක් තෝරා පද ලැයිස්තුව බලන්න · Roman අකුරින් ද ලිවිය හැක</div>
        </div>
        <div class="kosa-letters" style="margin-top:0.7rem;">${letters}</div>
        <div id="kosaGroups"></div>
        <div id="kosaWordList"></div>`;

    el.querySelectorAll('[data-kletter]').forEach(b => b.onclick = () => {
        const S2 = window.KosaState;
        S2.query = '';
        S2.letter = b.dataset.kletter;
        S2.group = null;
        S2.limitShown = KOSA_LIST_LIMIT;
        kosaLoadLetter(S2.letter).then(kosaRender).catch(kosaRender);
        kosaRender();
    });

    const input = document.getElementById('kosaSearchInput');
    if (input) {
        let t = null;
        input.oninput = () => {
            clearTimeout(t);
            const v = input.value;
            t = setTimeout(() => {
                window.KosaState.query = v;
                window.KosaState.limitShown = KOSA_LIST_LIMIT;
                kosaRenderList();
                kosaRenderGroups();
            }, 160);
        };
        input.onkeydown = (e) => { if (e.key === 'Escape') { input.value = ''; window.KosaState.query = ''; kosaRender(); } };
    }
    const clr = document.getElementById('kosaSearchClear');
    if (clr) clr.onclick = () => { window.KosaState.query = ''; kosaRender(); };

    const deep = document.getElementById('kosaDeepBtn');
    if (deep) deep.onclick = () => {
        const S2 = window.KosaState;
        if (S2.deep) { S2.deep = false; kosaRender(); return; }
        if (kosaAllLoaded()) { S2.deep = true; kosaRender(); return; }
        S2.deepLoading = true;
        kosaRender();
        kosaLoadAll().then(() => { S2.deep = true; }).catch(() => {}).then(() => {
            S2.deepLoading = false;
            kosaRender();
        });
    };

    kosaRenderGroups();
    kosaRenderList();
}

function kosaRenderGroups() {
    const el = document.getElementById('kosaGroups');
    if (!el) return;
    const S = window.KosaState;
    if (S.query || !S.letter) { el.innerHTML = ''; return; }
    const arr = (window.SabdaKosaData && window.SabdaKosaData[S.letter]) || null;
    if (!arr) { el.innerHTML = ''; return; }
    const groups = [];
    arr.forEach(e => { if (e.g && groups.indexOf(e.g) === -1) groups.push(e.g); });
    if (groups.length < 2) { el.innerHTML = ''; return; }
    el.innerHTML = '<div class="kosa-groups">' +
        `<button type="button" class="kosa-group ${!S.group ? 'active' : ''}" data-kgroup="">සියල්ල</button>` +
        groups.map(g => `<button type="button" class="kosa-group ${S.group === g ? 'active' : ''}" data-kgroup="${kosaEsc(g)}">${kosaEsc(g)}</button>`).join('') +
        '</div>';
    el.querySelectorAll('[data-kgroup]').forEach(b => b.onclick = () => {
        window.KosaState.group = b.dataset.kgroup || null;
        window.KosaState.limitShown = KOSA_LIST_LIMIT;
        kosaRenderGroups();
        kosaRenderList();
    });
}

/* ප්‍රවිෂ්ට ලැයිස්තුව: අකුර අනුව හෝ සෙවුම අනුව */
function kosaRenderList() {
    const el = document.getElementById('kosaWordList');
    if (!el) return;
    const S = window.KosaState;
    const eq = kosaQuery(S.query);
    const q = eq.q;
    const terms = kosaNorm(q).split(' ').filter(Boolean);

    let items = [];     // { l, i, h, snip }
    let note = '';

    if (terms.length) {
        const flat = kosaFlat();
        const hits = [];
        flat.forEach(x => {
            if (!terms.every(t => x.n.includes(t))) return;
            let score = 20;
            if (x.n === kosaNorm(q)) score = 100;
            else if (x.n.startsWith(terms[0])) score = 70;
            hits.push({ l: x.l, i: x.i, h: x.h, score });
        });
        hits.sort((a, b) => b.score - a.score || a.h.localeCompare(b.h, 'si'));
        items = hits;

        if (S.deep && kosaAllLoaded()) {
            const seen = new Set(items.map(x => x.l + '|' + x.i));
            const deepHits = [];
            (window.SabdaKosaIndex.letters || []).forEach(m => {
                (window.SabdaKosaData[m.l] || []).forEach((e, i) => {
                    if (seen.has(m.l + '|' + i)) return;
                    const text = kosaNorm((e.b || []).map(b => b[1]).join(' '));
                    if (!terms.every(t => text.includes(t))) return;
                    const raw = kosaPlain((e.b || []).map(b => b[1]).join(' '));
                    deepHits.push({ l: m.l, i, h: e.h, snip: (typeof searchSnippet === 'function' ? searchSnippet(raw, terms[0], 20, 60) : raw.slice(0, 80)) });
                });
            });
            items = items.concat(deepHits);
            note = `පද නාමයෙන් ${hits.length}ක් · විස්තර තුළින් ${deepHits.length}ක්`;
        } else {
            note = `පද නාමයෙන් ${hits.length}ක් හමු විය` + (S.deepLoading ? '' : ' · විස්තර තුළද සෙවීමට ඉහත බොත්තම ඔබන්න');
        }
        if (eq.converted) note = '🔁 සිංහලට හරවා සෙවීය: ' + eq.converted + ' · ' + note;
    } else if (S.letter) {
        const meta = kosaLetterMeta(S.letter);
        const arr = (window.SabdaKosaData && window.SabdaKosaData[S.letter]) || null;
        if (!arr) {
            el.innerHTML = '<div class="kosa-loading">⏳ "' + kosaEsc(S.letter) + '" අකුරේ පද පූරණය වේ…</div>';
            return;
        }
        arr.forEach((e, i) => {
            if (S.group && e.g !== S.group) return;
            items.push({ l: S.letter, i, h: e.h });
        });
        note = kosaEsc(S.letter) + ' — පද ' + items.length + 'ක්' + (meta && !S.group ? '' : '');
    } else {
        el.innerHTML = '<div class="kosa-list-note">↑ අකුරක් තෝරන්න, නැතහොත් පදයක් සොයන්න.</div>';
        return;
    }

    if (!items.length) {
        el.innerHTML = '<div class="kosa-list-note">ප්‍රතිඵල හමු නොවීය.' + (terms.length && !S.deep ? ' විස්තර තුළද සෙවීමට ඉහත බොත්තම ඔබන්න.' : '') + '</div>';
        return;
    }

    const cap = terms.length ? Math.min(S.limitShown, KOSA_SEARCH_LIMIT * Math.ceil(S.limitShown / KOSA_LIST_LIMIT)) : S.limitShown;
    const shown = items.slice(0, cap);
    const more = items.length - shown.length;

    el.innerHTML =
        '<div class="kosa-word-grid">' + shown.map(x =>
            `<button type="button" class="kosa-word ${(S.letterIndex === x.l && S.wordIndex === x.i) ? 'active' : ''}" data-kl="${kosaEsc(x.l)}" data-ki="${x.i}" title="${kosaEsc(x.h)}">${terms.length ? kosaHighlight(x.h, q) : kosaEsc(x.h)}${x.snip ? `<span class="kosa-w-snip">${kosaHighlight(x.snip, q)}</span>` : ''}</button>`).join('') + '</div>' +
        (note ? '<div class="kosa-list-note">' + note + '</div>' : '') +
        (more > 0 ? `<button type="button" class="kosa-more-btn" id="kosaMoreBtn">තවත් ${more}ක් පෙන්වන්න ›</button>` : '');

    el.querySelectorAll('[data-kl]').forEach(b => b.onclick = () => {
        kosaOpenEntry(b.dataset.kl, Number(b.dataset.ki));
    });
    const mb = document.getElementById('kosaMoreBtn');
    if (mb) mb.onclick = () => { window.KosaState.limitShown += KOSA_LIST_LIMIT; kosaRenderList(); };
}

/* ප්‍රවිෂ්ටය විවෘත කිරීම */
function kosaOpenEntry(letter, i, noScroll) {
    const S = window.KosaState;
    S.letterIndex = letter;
    S.wordIndex = i;
    const show = () => {
        kosaRenderEntry();
        kosaRenderList();
        if (!noScroll) {
            const card = document.getElementById('kosaEntry');
            if (card && card.scrollIntoView) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        try {
            const e = kosaEntry(letter, i);
            if (typeof appHistoryPush === 'function') appHistoryPush({ kosa: 1, kl: letter, ki: i, kw: e ? e.h : '' });
        } catch (err) { /* නොසලකන්න */ }
    };
    if (window.SabdaKosaData && window.SabdaKosaData[letter]) { show(); return; }
    kosaRenderEntry();
    kosaLoadLetter(letter).then(show).catch(() => kosaRenderEntry());
}

function kosaRenderEntry() {
    const card = document.getElementById('kosaEntry');
    if (!card) return;
    const S = window.KosaState;
    if (S.letterIndex === null || S.wordIndex === null) { card.style.display = 'none'; card.innerHTML = ''; return; }
    card.style.display = 'block';

    const e = kosaEntry(S.letterIndex, S.wordIndex);
    if (!e) { card.innerHTML = '<div class="kosa-loading">⏳ ප්‍රවිෂ්ටය පූරණය වේ…</div>'; return; }

    const eq = kosaQuery(S.query);
    const pos = kosaFlatPos(S.letterIndex, S.wordIndex);
    const flat = kosaFlat();
    const prev = pos > 0 ? flat[pos - 1] : null;
    const next = (pos !== -1 && pos < flat.length - 1) ? flat[pos + 1] : null;

    card.innerHTML = `
        <div class="kosa-entry-head">
            <h2>${kosaEsc(e.h)}</h2>
            ${e.g ? `<span class="kosa-badge">${kosaEsc(e.g)} කාණ්ඩය</span>` : ''}
            ${e.d ? '<span class="kosa-badge">එම පදයම (〃)</span>' : ''}
            <span class="kosa-badge">ව්‍යාකරණ සද්දසින්ධු</span>
        </div>
        <div class="kosa-body">${kosaBlocksHtml(e.b, eq.q && kosaNorm(eq.q) ? eq.q : '')}</div>
        <div class="kosa-pager">
            <button type="button" id="kosaPrev" ${prev ? `data-kl="${kosaEsc(prev.l)}" data-ki="${prev.i}"` : 'disabled'}>◀ ${prev ? kosaEsc(prev.h) : 'පෙර පදය'}</button>
            <button type="button" id="kosaNext" ${next ? `data-kl="${kosaEsc(next.l)}" data-ki="${next.i}"` : 'disabled'}>${next ? kosaEsc(next.h) : 'ඊළඟ පදය'} ▶</button>
        </div>`;

    ['kosaPrev', 'kosaNext'].forEach(id => {
        const b = document.getElementById(id);
        if (b && !b.disabled) b.onclick = () => kosaOpenEntry(b.dataset.kl, Number(b.dataset.ki), true);
    });
}

/* පෙරවදන / සංකේත / ශුද්ධිපත්‍රය */
function kosaRenderFront() {
    const browse = document.getElementById('kosaBrowse');
    const entry = document.getElementById('kosaEntry');
    if (entry) { entry.style.display = 'none'; entry.innerHTML = ''; }
    if (!browse) return;
    if (!window.SabdaKosaFront) {
        browse.innerHTML = '<div class="kosa-loading">⏳ පෙරවදන පූරණය වේ…</div>';
        kosaLoadScript('sabdakosa_front.js').then(kosaRenderFront).catch(() => {
            browse.innerHTML = '<div class="kosa-loading">පෙරවදන පූරණය කළ නොහැකි විය.</div>';
        });
        return;
    }
    browse.innerHTML = '<h3 class="section-heading"><span class="heading-icon">📖</span> පෙරවදන, සංඥාපනය හා සංකේත</h3>' +
        '<div class="kosa-front kosa-body">' + kosaBlocksHtml(window.SabdaKosaFront, '') + '</div>';
}

function kosaRender() {
    kosaRenderBanner();
    if (window.KosaState.tab === 'front') { kosaRenderFront(); return; }
    kosaRenderBrowse();
    kosaRenderEntry();
}

/* ---------- ඛණ්ඩය විවෘත / වැසීම ---------- */
function hideKosaPanel() {
    const p = document.getElementById('viewKosaPanel');
    if (p) p.style.display = 'none';
    const b = document.getElementById('btnSabdaKosa');
    if (b) b.classList.remove('active');
}

function showSabdaKosa(opts) {
    const o = opts || {};
    AppState.currentMode = 'kosa';
    AppState.activeKhandaKey = null;
    AppState.activeSubKhandaId = null;

    if (typeof switchTheme === 'function') switchTheme('kosa');

    const introPanel = document.getElementById('viewIntroPanel');
    const suttaPanel = document.getElementById('viewSuttaPanel');
    const kosaPanel = document.getElementById('viewKosaPanel');
    if (introPanel) introPanel.style.display = 'none';
    if (suttaPanel) suttaPanel.style.display = 'none';
    if (kosaPanel) kosaPanel.style.display = 'flex';

    const pager = document.getElementById('suttaPager');
    if (pager) pager.innerHTML = '';

    const btnIntro = document.getElementById('btnShadakaraIntro');
    if (btnIntro) btnIntro.classList.remove('active');
    const btnKosa = document.getElementById('btnSabdaKosa');
    if (btnKosa) btnKosa.classList.add('active');

    document.querySelectorAll('.subkhanda-tree-container').forEach(el => el.classList.remove('expanded'));
    document.querySelectorAll('.khanda-tab').forEach(el => el.classList.remove('active'));
    if (typeof renderKhandaTreeNavigation === 'function') renderKhandaTreeNavigation();

    const S = window.KosaState;
    if (o.query !== undefined) S.query = o.query;
    if (!S.letter && !S.query && window.SabdaKosaIndex && window.SabdaKosaIndex.letters.length) {
        S.letter = window.SabdaKosaIndex.letters[0].l;
        kosaLoadLetter(S.letter).then(kosaRenderList).catch(() => {});
    }
    S.tab = o.tab || 'words';

    kosaRender();

    if (o.letter && o.index !== undefined && o.index !== null) {
        kosaOpenEntry(o.letter, Number(o.index), true);
    } else if (o.word) {
        kosaOpenWord(o.word);
    } else if (!o.noHistory) {
        try { if (typeof appHistoryPush === 'function') appHistoryPush({ kosa: 1 }); } catch (e) { /* නොසලකන්න */ }
    }

    const vp = document.getElementById('mainViewport');
    if (vp) vp.scrollTop = 0;
    window.scrollTo(0, 0);
}

/* පදයක් නමින් විවෘත කිරීම (සර්වත්‍ර සෙවුම සඳහා) */
function kosaOpenWord(word) {
    const n = kosaNorm(word);
    const hit = kosaFlat().find(x => x.n === n) || kosaFlat().find(x => x.n.startsWith(n));
    if (!hit) return false;
    const S = window.KosaState;
    S.query = '';
    S.letter = hit.l;
    S.group = null;
    kosaOpenEntry(hit.l, hit.i, true);
    return true;
}

/* සර්වත්‍ර සෙවුමෙන් ශබ්දකෝෂ ප්‍රතිඵලයක් විවෘත කිරීම */
function navigateToKosaEntry(letter, i) {
    showSabdaKosa({ letter, index: i, noHistory: true });
    if (typeof hideSidebarMenu === 'function') hideSidebarMenu();
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnSabdaKosa');
    if (btn) btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSabdaKosa({});
        // දුරකථනයේ ඛාණ්ඩ ලැයිස්තුව වසා ශබ්දකෝෂය පෙන්වීම
        if (typeof hideSidebarMenu === 'function') hideSidebarMenu();
    });
});
