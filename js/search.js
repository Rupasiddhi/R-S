/**
 * ==========================================================================
 * සර්වත්‍ර සෙවුම (js/search.js)
 * ප්‍රතිඵල වර්ග 3කි:  📜 සූත්‍ර  ·  🔤 පද සාධන (පදයක් ක්ලික් කළ විට එහි සාධනයටම යයි)  ·  📖 අන්තර්ගතය
 * (වෘත්තිය, සන්නය, ෂඩාකාරය, විස්තර, ටීකා, සටහන්, සෑදෙන පද ආදී සියල්ල)
 * Roman අකුරින් (dīgha / diigha / dhammo) ටයිප් කළත් සිංහලට හරවා සොයයි.
 * ==========================================================================
 */
let SEARCH_INDEX = null;
let searchActiveIndex = -1;
let searchCurrentResults = [];
let searchCat = 'all';
let searchLastQuery = '';

const SEARCH_CATS = [
    { key: 'all', label: 'සියල්ල', icon: '✨' },
    { key: 'sutta', label: 'සූත්‍ර', icon: '📜' },
    { key: 'word', label: 'පද සාධන', icon: '🔤' },
    { key: 'content', label: 'අන්තර්ගතය', icon: '📖' }
];
const SEARCH_ALL_LIMITS = { sutta: 5, word: 8, content: 6 };
const SEARCH_TAB_LIMIT = 60;
const SEARCH_KHANDA_COLOR = { '1_sandhi': '#B45309', '2_nama': '#9B2C2C', '3_karaka': '#2C7A7B', '4_samasa': '#6B46C1', '5_taddhita': '#2B6CB0', '6_akhyata': '#2F855A', '7_kibbhidhana': '#B7791F' };
const SEARCH_SUGGESTIONS = ['දීඝං', 'සරා සරෙ ලොපං', 'පචති', 'පුරිස', 'ක්වචි', 'ඉති'];

/* ---------- Helpers ---------- */
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
    return String(text == null ? '' : text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
function cleanDisplayText(text) {
    return String(text || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/[*~\[\]]/g, '').replace(/\s+/g, ' ').trim();
}
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
function searchSnippet(raw, term, before = 45, after = 70) {
    const display = cleanDisplayText(raw);
    const m = termRegex(term).exec(display);
    if (!m) return display.slice(0, before + after);
    let start = Math.max(0, m.index - before);
    if (start > 0) { const sp = display.indexOf(' ', start); start = (sp !== -1 && sp < m.index) ? sp + 1 : m.index; }
    const end = Math.min(display.length, m.index + m[0].length + after);
    return (start > 0 ? '…' : '') + display.slice(start, end) + (end < display.length ? '…' : '');
}

/* ---------- Roman → සිංහල (IAST / සරල ASCII) ---------- */
const SR_VOW = { a: ['අ', ''], 'ā': ['ආ', 'ා'], i: ['ඉ', 'ි'], 'ī': ['ඊ', 'ී'], u: ['උ', 'ු'], 'ū': ['ඌ', 'ූ'], e: ['එ', 'ෙ'], o: ['ඔ', 'ො'] };
const SR_CON = { k: 'ක', kh: 'ඛ', g: 'ග', gh: 'ඝ', 'ṅ': 'ඞ', c: 'ච', ch: 'ඡ', j: 'ජ', jh: 'ඣ', 'ñ': 'ඤ', 'ṭ': 'ට', 'ṭh': 'ඨ', 'ḍ': 'ඩ', 'ḍh': 'ඪ', 'ṇ': 'ණ', t: 'ත', th: 'ථ', d: 'ද', dh: 'ධ', n: 'න', p: 'ප', ph: 'ඵ', b: 'බ', bh: 'භ', m: 'ම', y: 'ය', r: 'ර', l: 'ල', v: 'ව', s: 'ස', h: 'හ', 'ḷ': 'ළ' };
function latinToSinhala(q) {
    let s = String(q).normalize('NFC');
    s = s.replace(/T/g, 'ṭ').replace(/D/g, 'ḍ').replace(/N/g, 'ṇ').replace(/L/g, 'ḷ').replace(/M/g, 'ṃ').replace(/G/g, 'ṅ').replace(/Y/g, 'ñ');
    s = s.toLowerCase().replace(/aa/g, 'ā').replace(/ii/g, 'ī').replace(/uu/g, 'ū');
    const toks = []; let i = 0;
    while (i < s.length) {
        const ch = s[i];
        if (ch === 'ṃ') { toks.push({ t: 'n' }); i++; continue; }
        if (SR_VOW[ch]) { toks.push({ t: 'v', v: ch }); i++; continue; }
        const d = s.slice(i, i + 2);
        if (SR_CON[d]) { toks.push({ t: 'c', c: SR_CON[d] }); i += 2; continue; }
        if (SR_CON[ch]) { toks.push({ t: 'c', c: SR_CON[ch] }); i++; continue; }
        toks.push({ t: 'o', s: ch }); i++;
    }
    let out = '';
    for (let k = 0; k < toks.length; k++) {
        const x = toks[k], nx = toks[k + 1];
        if (x.t === 'o') out += x.s;
        else if (x.t === 'n') out += 'ං';
        else if (x.t === 'v') out += SR_VOW[x.v][0];
        else if (nx && nx.t === 'v') { out += x.c + SR_VOW[nx.v][1]; k++; }
        else { out += x.c + '්'; if (nx && nx.t === 'c' && (nx.c === 'ර' || nx.c === 'ය')) out += '‍'; }
    }
    return out;
}
function searchEffectiveQuery(raw) {
    const q = String(raw || '').trim();
    if (q && /[A-Za-zāīūṃṅñṭḍṇḷ]/.test(q) && !/[඀-෿]/.test(q)) {
        const conv = latinToSinhala(q);
        return { q: conv, converted: conv !== q ? conv : null };
    }
    return { q, converted: null };
}

/* ---------- Index ---------- */
const SEARCH_FIELD_LABELS = {
    sutta_meaning: 'අර්ථය', meaning: 'අර්ථය', vutti: 'වෘත්තිය', vutti_sanna: 'සන්නය', sutta_type: 'සූත්‍ර වර්ගය',
    pada_cheda: 'පදච්ඡේදය', anuvattana: 'අනුවර්තනය', extended_commentary: 'විස්තරය', formed_words: 'සෑදෙන පද',
    counter_examples: 'ප්‍රත්‍යුදාහරණ', similar_words: 'සමාන පද', notes: 'සටහන්',
    sambandha: 'සම්බන්ධ', pada: 'පද', padattha: 'පදත්ථ', padaviggaha: 'පදවිග්ගහ', chodana: 'චොදනා', parihara: 'පරිහාර',
    sambandha_pali: 'සම්බන්ධ', pada_pali: 'පද', padattha_pali: 'පදත්ථ', padaviggaha_pali: 'පදවිග්ගහ', chodana_pali: 'චොදනා', parihara_pali: 'පරිහාර'
};
const SEARCH_SKIP_KEYS = new Set(['sutta_number', 'sub_khanda_id', 'sub_khanda_name', 'khanda_badge', 'sutta_name', 'sutta', 'id', 'word', 'verb', 'ending', 'linga', 'group_key', 'sandhi_group', 'sandhi', 'hide_declension', 'derivations', 'examples', 'declension', 'stem_steps', 'steps', 'stem', 'is_intro', 'is_appendix', 'key', 'rule', 'formula']);
const SEARCH_TITLE_KEYS = new Set(['sutta_meaning', 'meaning', 'sutta_type', 'pada_cheda', 'anuvattana']);

function searchCollect(obj, label, out, depth) {
    if (obj == null || depth > 4) return;
    if (typeof obj === 'string') { if (obj.trim().length > 2) out.push({ label, raw: obj }); return; }
    if (Array.isArray(obj)) { obj.forEach(v => searchCollect(v, label, out, depth + 1)); return; }
    if (typeof obj === 'object') {
        Object.keys(obj).forEach(k => {
            if (SEARCH_SKIP_KEYS.has(k)) return;
            searchCollect(obj[k], SEARCH_FIELD_LABELS[k] || label || 'අන්තර්ගතය', out, depth + 1);
        });
    }
}

// ටීකා / සටහන් දත්ත ගොනු → ඛාණ්ඩය
const SEARCH_EXTRA_DATA = {
    '1_sandhi': [['SandhiTika', 'ටීකා / විවරණ'], ['SandhiSuttaNotes', 'සූත්‍ර සටහන්']],
    '2_nama': [['NamaTika', 'ටීකා / විවරණ'], ['NamaSuttaNotes', 'සූත්‍ර සටහන්']],
    '4_samasa': [['SamasaTika', 'ටීකා / විවරණ'], ['SamasaSuttaNotes', 'සූත්‍ර සටහන්']],
    '5_taddhita': [['TaddhitaTika', 'ටීකා / විවරණ'], ['TaddhitaSuttaNotes', 'සූත්‍ර සටහන්']],
    '6_akhyata': [['AkhyataTika', 'ටීකා / විවරණ'], ['AkhyataSuttaNotes', 'සූත්‍ර සටහන්']],
    '7_kibbhidhana': [['KitakaTika', 'ටීකා / විවරණ'], ['KitakaSuttaNotes', 'සූත්‍ර සටහන්']]
};

function buildSearchIndex() {
    const db = window.SuttaDatabase || {};
    const idx = { sutta: [], word: [], content: [] };

    KHANDAS_CONFIG.forEach(khanda => {
        const itemByNum = {};
        (khanda.subCategories || []).forEach(sub => {
            (db[sub.id] || []).forEach(sutta => {
                const num = sutta.sutta_number !== undefined ? sutta.sutta_number : sutta.id;
                const title = sutta.sutta_name || sutta.sutta || sutta.word || '';
                const base = { khandaKey: khanda.key, khandaName: khanda.name, subId: sub.id, subName: sub.name, num, title };
                if (!/_sadhana$/.test(sub.id) && !sutta.is_intro && itemByNum[num] === undefined) itemByNum[num] = { base, sutta };

                // 1) සූත්‍ර
                const meta = [];
                Object.keys(sutta).forEach(k => { if (SEARCH_TITLE_KEYS.has(k)) searchCollect(sutta[k], SEARCH_FIELD_LABELS[k], meta, 0); });
                idx.sutta.push({ ...base, type: 'sutta', titleNorm: normalizeSearchText(title), numStr: String(num), meta: meta.map(m => ({ label: m.label, raw: m.raw, norm: normalizeSearchText(m.raw) })) });

                // 2) පද (පද සාධන රූප)
                const seen = new Set();
                const addWord = (w, i, src, fin) => {
                    if (!w || typeof w !== 'string') return;
                    const key = w + '|' + i + '|' + src;
                    if (seen.has(key)) return; seen.add(key);
                    idx.word.push({ ...base, type: 'word', word: w, wordNorm: normalizeSearchText(w), finalNorm: normalizeSearchText(fin || ''), wi: i, src });
                };
                (sutta.derivations || []).forEach((d, i) => addWord(d.word, i, 'deriv', d.final_result));
                (sutta.examples || []).forEach((ex, i) => addWord(ex.word, i, 'example', ex.final_result));
                (sutta.declension || []).forEach(row => [].concat(row.eka || [], row.bahu || []).forEach(w => addWord(w, null, 'decl')));
                if (/_sadhana$/.test(sub.id) && sutta.word && !sutta.sandhi) addWord(sutta.word, (sutta.derivations && sutta.derivations.length) ? 0 : null, 'item');

                // 3) අන්තර්ගතය
                const fields = [];
                Object.keys(sutta).forEach(k => {
                    if (SEARCH_SKIP_KEYS.has(k) || SEARCH_TITLE_KEYS.has(k)) return;
                    searchCollect(sutta[k], SEARCH_FIELD_LABELS[k], fields, 0);
                });
                (sutta.derivations || []).forEach(d => (d.steps || []).forEach(() => {}));
                const f2 = fields.map(f => ({ label: f.label || 'අන්තර්ගතය', raw: f.raw, norm: normalizeSearchText(f.raw) }));
                if (f2.length) idx.content.push({ ...base, type: 'content', fields: f2 });
            });
        });

        // ටීකා / සටහන්
        (SEARCH_EXTRA_DATA[khanda.key] || []).forEach(([name, lbl]) => {
            const data = window[name] || {};
            Object.keys(data).forEach(n => {
                const holder = itemByNum[n] || itemByNum[Number(n)];
                if (!holder) return;
                const fields = [];
                (data[n] || []).forEach(e => {
                    const lab = e.kind === 'rupa' ? 'රූපසිද්ධි පාඨය' : (e.kind === 'tika' ? 'ටීකා' : lbl);
                    [e.title, e.context, e.pali, e.sanna, e.html].forEach(t => { if (typeof t === 'string' && t.trim().length > 2) fields.push({ label: lab, raw: t, norm: normalizeSearchText(t) }); });
                });
                if (fields.length) idx.content.push({ ...holder.base, type: 'content', fields });
            });
        });
    });
    return idx;
}

/* ---------- Search ---------- */
function searchTerms(q) { return normalizeSearchText(q).split(' ').filter(Boolean); }

function runSearch(q) {
    if (!SEARCH_INDEX) SEARCH_INDEX = buildSearchIndex();
    const nq = normalizeSearchText(q);
    const terms = searchTerms(q);
    const out = { sutta: [], word: [], content: [] };
    if (!terms.length) return out;

    SEARCH_INDEX.sutta.forEach(e => {
        let score = 0, snippet = null;
        const inTitle = terms.every(t => e.titleNorm.includes(t));
        if (e.numStr === nq) score = 120;
        else if (inTitle) score = e.titleNorm.replace(/^[^\s]*\.\s*/, '').startsWith(nq) ? 90 : (e.titleNorm.includes(nq) ? 70 : 55);
        else {
            const all = e.meta.map(m => m.norm).join(' ');
            if (terms.every(t => all.includes(t))) {
                const f = e.meta.find(m => m.norm.includes(terms[0])) || e.meta[0];
                score = 25; snippet = { label: f.label || 'අර්ථය', text: searchSnippet(f.raw, terms[0]) };
            }
        }
        if (score) out.sutta.push({ entry: e, score, snippet });
    });

    SEARCH_INDEX.word.forEach(e => {
        const hay = e.wordNorm + ' ' + e.finalNorm;
        if (!terms.every(t => hay.includes(t))) return;
        let score = 30;
        if (e.wordNorm === nq || e.finalNorm === nq) score = 100;
        else if (e.wordNorm.startsWith(nq)) score = 75;
        else if (e.wordNorm.includes(nq)) score = 50;
        if (e.src === 'deriv' || e.src === 'example' || e.src === 'item') score += 5;
        out.word.push({ entry: e, score });
    });

    SEARCH_INDEX.content.forEach(e => {
        const all = e.fields.map(f => f.norm).join(' ');
        if (!terms.every(t => all.includes(t))) return;
        const f = e.fields.find(x => terms.every(t => x.norm.includes(t))) || e.fields.find(x => x.norm.includes(terms[0]));
        if (!f) return;
        let hits = 0; const re = termRegex(terms[0]); const d = cleanDisplayText(f.raw); let m; while ((m = re.exec(d)) && hits < 20) { hits++; if (!m[0].length) re.lastIndex++; }
        let score = 10 + Math.min(hits, 10) + (terms.every(t => f.norm.includes(t)) ? 8 : 0);
        if (/වෘත්තිය|සන්නය|අර්ථය|විස්තරය/.test(f.label)) score += 3;
        out.content.push({ entry: e, score, snippet: { label: f.label, text: searchSnippet(f.raw, terms[0]) } });
    });

    ['sutta', 'word', 'content'].forEach(k => out[k].sort((a, b) => b.score - a.score));
    return out;
}

/* ---------- Recent ---------- */
function searchRecentGet() { try { return JSON.parse(localStorage.getItem('rs_recent_searches') || '[]').slice(0, 6); } catch (e) { return []; } }
function searchRecentAdd(q) {
    q = String(q || '').trim(); if (!q) return;
    try { const l = searchRecentGet().filter(x => x !== q); l.unshift(q); localStorage.setItem('rs_recent_searches', JSON.stringify(l.slice(0, 6))); } catch (e) { /* ignore */ }
}
function searchRecentClear() { try { localStorage.removeItem('rs_recent_searches'); } catch (e) { /* ignore */ } renderSearchResults(''); }

/* ---------- Rendering ---------- */
function searchPath(e) {
    const c = SEARCH_KHANDA_COLOR[e.khandaKey] || '#8C2D00';
    return `<span class="sr-path"><i class="sr-dot" style="background:${c}"></i>${escapeHtml(e.khandaName)} › ${escapeHtml(e.subName)}</span>`;
}
function searchResultHtml(r, i, q) {
    const e = r.entry;
    const act = i === searchActiveIndex ? ' active' : '';
    const titleText = String(e.title).replace(/^\s*[^\s.]+\.\s+/, '');
    if (e.type === 'word') {
        return `<button type="button" class="search-result-item sr-word${act}" role="option" data-idx="${i}">
            <span class="sr-icon">🔤</span>
            <span class="sr-main">
                <span class="sr-word-pill">${highlightTerms(e.word, q)}</span>
                <span class="sr-sub">${escapeHtml(e.num)}. ${escapeHtml(titleText)}</span>
                ${searchPath(e)}
            </span><span class="sr-go">සාධනය ›</span></button>`;
    }
    if (e.type === 'sutta') {
        return `<button type="button" class="search-result-item sr-sutta${act}" role="option" data-idx="${i}">
            <span class="sr-icon">📜</span>
            <span class="sr-main">
                <span class="sr-title"><strong>${escapeHtml(e.num)}.</strong> ${highlightTerms(titleText, q)}</span>
                ${r.snippet ? `<span class="sr-snippet"><em>${escapeHtml(r.snippet.label)}:</em> ${highlightTerms(r.snippet.text, q)}</span>` : ''}
                ${searchPath(e)}
            </span></button>`;
    }
    return `<button type="button" class="search-result-item sr-content${act}" role="option" data-idx="${i}">
        <span class="sr-icon">📖</span>
        <span class="sr-main">
            <span class="sr-title"><strong>${escapeHtml(e.num)}.</strong> ${escapeHtml(titleText)}</span>
            <span class="sr-snippet"><em class="sr-label">${escapeHtml(r.snippet.label)}</em> ${highlightTerms(r.snippet.text, q)}</span>
            ${searchPath(e)}
        </span></button>`;
}

function searchEmptyStateHtml() {
    const rec = searchRecentGet();
    return `<div class="sr-empty-state">
        ${rec.length ? `<div class="sr-block-title">🕘 මෑත සෙවීම් <button type="button" class="sr-clear" data-act="clear">මකන්න</button></div>
            <div class="sr-chips">${rec.map(x => `<button type="button" class="sr-chip" data-q="${escapeHtml(x)}">${escapeHtml(x)}</button>`).join('')}</div>` : ''}
        <div class="sr-block-title">💡 උත්සාහ කරන්න</div>
        <div class="sr-chips">${SEARCH_SUGGESTIONS.map(x => `<button type="button" class="sr-chip" data-q="${escapeHtml(x)}">${escapeHtml(x)}</button>`).join('')}</div>
        <ul class="sr-tips">
            <li>📜 <b>සූත්‍ර</b> — නමින් හෝ අංකයෙන් (උදා: <i>17</i>)</li>
            <li>🔤 <b>පද සාධන</b> — පදයක් ක්ලික් කළ විට එහි සාධනයටම යයි</li>
            <li>📖 <b>අන්තර්ගතය</b> — වෘත්තිය, සන්නය, ටීකා, සටහන් ඇතුළු සියල්ල</li>
            <li>⌨️ Roman අකුරින් ද ලිවිය හැක: <i>dīgha</i> / <i>diigha</i> / <i>dhammo</i></li>
        </ul></div>`;
}

function renderSearchResults(query) {
    const box = document.getElementById('searchResults');
    if (!box) return;
    const raw = String(query == null ? '' : query);
    searchLastQuery = raw;

    const { q, converted } = searchEffectiveQuery(raw);
    if (!normalizeSearchText(q)) {
        searchCurrentResults = []; searchActiveIndex = -1;
        box.innerHTML = searchEmptyStateHtml();
        box.classList.add('open');
        bindSearchBox(box);
        return;
    }

    const res = runSearch(q);
    const counts = { sutta: res.sutta.length, word: res.word.length, content: res.content.length };
    counts.all = counts.sutta + counts.word + counts.content;

    let flat = [], sections = [];
    if (searchCat === 'all') {
        ['sutta', 'word', 'content'].forEach(k => {
            const part = res[k].slice(0, SEARCH_ALL_LIMITS[k]);
            if (part.length) sections.push({ key: k, items: part, more: res[k].length - part.length });
        });
    } else {
        const part = res[searchCat].slice(0, SEARCH_TAB_LIMIT);
        if (part.length) sections.push({ key: searchCat, items: part, more: res[searchCat].length - part.length });
    }
    sections.forEach(s => s.items.forEach(r => flat.push(r)));
    searchCurrentResults = flat;
    searchActiveIndex = flat.length ? 0 : -1;

    const tabs = SEARCH_CATS.map(c => `<button type="button" class="sr-tab ${c.key === searchCat ? 'active' : ''}" data-cat="${c.key}" role="tab"><span>${c.icon}</span> ${c.label} <b>${counts[c.key]}</b></button>`).join('');
    const secTitle = { sutta: '📜 සූත්‍ර', word: '🔤 පද සාධන', content: '📖 අන්තර්ගතය' };
    let i = 0;
    const body = flat.length ? sections.map(s => `
        <div class="sr-section">
            ${searchCat === 'all' ? `<div class="sr-section-title">${secTitle[s.key]} <span>${res[s.key].length}</span></div>` : ''}
            ${s.items.map(r => searchResultHtml(r, i++, q)).join('')}
            ${s.more > 0 && searchCat === 'all' ? `<button type="button" class="sr-more" data-cat="${s.key}">තවත් ${s.more}ක් බලන්න ›</button>` : ''}
            ${s.more > 0 && searchCat !== 'all' ? `<div class="search-count">තවත් ${s.more}ක් ඇත — සෙවුම තව පටු කරන්න</div>` : ''}
        </div>`).join('') : `<div class="search-empty">“${escapeHtml(raw)}” සඳහා ${searchCat === 'all' ? '' : 'මෙම වර්ගයේ '}ප්‍රතිඵල හමු නොවීය.${searchCat !== 'all' && counts.all ? ` <button type="button" class="sr-more" data-cat="all">සියල්ල බලන්න (${counts.all}) ›</button>` : ''}</div>`;

    box.innerHTML = `
        <div class="sr-head"><div class="sr-tabs" role="tablist">${tabs}</div>
        ${converted ? `<div class="sr-converted">🔁 සිංහලට හරවා සෙවීය: <b>${escapeHtml(converted)}</b></div>` : ''}</div>
        <div class="sr-body">${body}</div>`;
    bindSearchBox(box);
    box.classList.add('open');
}

function bindSearchBox(box) {
    box.querySelectorAll('.search-result-item').forEach(btn => {
        btn.addEventListener('click', (e) => { e.stopPropagation(); openSearchResult(Number(btn.dataset.idx)); });
    });
    box.querySelectorAll('.sr-tab, .sr-more').forEach(btn => {
        btn.addEventListener('click', (e) => { e.stopPropagation(); searchCat = btn.dataset.cat; renderSearchResults(searchLastQuery); });
    });
    box.querySelectorAll('.sr-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const input = document.getElementById('globalSearchInput');
            if (input) { input.value = btn.dataset.q; input.focus(); }
            searchCat = 'all'; renderSearchResults(btn.dataset.q);
        });
    });
    box.querySelectorAll('.sr-clear').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); searchRecentClear(); }));
}

function closeSearchResults() {
    const box = document.getElementById('searchResults');
    if (box) { box.classList.remove('open'); box.innerHTML = ''; }
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
    const e = result.entry;
    searchRecentAdd(searchLastQuery);
    closeSearchResults();
    const input = document.getElementById('globalSearchInput');
    if (input) input.blur();

    navigateToSutta(e.khandaKey, e.subId, e.num);
    if (e.type === 'word') openSearchedWord(e);
}

// පදයක් තේරූ විට එහි පද සාධනය සෘජුව විවෘත කිරීම
function openSearchedWord(e) {
    if (e.wi == null) return;
    try {
        if (e.subId === '06b_sandhi_pada_sadhana' && typeof showSandhiWord === 'function') { showSandhiWord(e.wi); return; }
        if (typeof isPadaSadhanaSubKhanda === 'function' && isPadaSadhanaSubKhanda(e.subId) && typeof updatePadaSadhanaView === 'function' && document.getElementById('padaSadhanaContainer')) { updatePadaSadhanaView(e.wi, true); return; }
        const tabs = document.querySelectorAll('.example-tab-btn');
        if (tabs[e.wi]) { tabs[e.wi].click(); const c = document.getElementById('derivationStepsBody'); if (c && c.scrollIntoView) c.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    } catch (err) { /* ignore */ }
}
