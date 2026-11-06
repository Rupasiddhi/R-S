// ==========================================================================
// ජිනවචනයුත්තං හි — සියලු නාම/සමාස/තද්ධිත පද සාධනවල මුල් පියවර
// ප්‍රාතිපදිකය සිද්ධ කිරීමට පෙර "ජිනවචනයුත්තං හි." සූත්‍රය පළමු පියවර ලෙස එක් කරයි
// (නාමකණ්ඩයේ 60 වන සූත්‍රයේ උදාහරණයේ මෙන්).
// ==========================================================================
(function () {
    const RULE = 'ජිනවචනයුත්තං හි.';
    const STARTS = [/^ලිඞ්ගඤ්ච නිපච්චතෙ/, /^තතො ච විභත්තියො/, /^ලිඞ්ගත්ථෙ පඨමා/];
    const SKIP_SUB = /^(01_sanna|02_sara|03_byanjana|04_niggahita|05_pakati|0\d_akhyata|0\d_kitaka|07_abyaya)/;

    const NAMA_SUB = /^0[1-6]b?_(pullinga|itthilinga|napumsakalinga|sabbanama|alinga|vibhattippaccaya)/;

    function fix(steps, anyRule) {
        if (!Array.isArray(steps) || !steps.length) return;
        const first = steps[0] || {};
        const rule = String(first.rule || '').trim();
        if (rule.indexOf('ජිනවචනයුත්තං හි') !== -1) return;
        if (!anyRule && !STARTS.some(re => re.test(rule))) return;
        const f = String(first.formula || '').trim();
        const stem = f.split(' + ')[0].replace(/\s*\(.*\)\s*$/, '').trim();
        if (!stem || /[~\[\]→=]/.test(stem)) return;
        steps.unshift({ formula: stem, rule: RULE });
    }

    // ආදේශ සූත්‍ර ("සො.", "අතො නෙන." ආදිය) — "සි → ඔ" ආදේශයක් බැවින් කොටුවක් සහිත ආදේශ ආකාරයෙන් (සි→ඔ) පෙන්වයි
    const SUBST_RULES = /^(සො\.|සබ්බයොනීනමාඑ|අතො නෙන|සබ්බනාමකාරතෙ පඨමො|ඝපතො ස්මිංසානං|ත්‍රතොථෙසු)/;
    function fixSubst(steps) {
        (steps || []).forEach(st => {
            if (!st || !SUBST_RULES.test(String(st.rule || '').trim())) return;
            const m = String(st.formula || '').match(/^(.*\+ )(\S+) → (\S+)$/);
            if (m) st.formula = m[1] + m[2] + '→' + m[3];
        });
    }

    const db = window.SuttaDatabase || {};
    Object.keys(db).forEach(sub => {
        if (SKIP_SUB.test(sub)) return;
        (db[sub] || []).forEach(s => {
            ['examples', 'derivations'].forEach(k => (s[k] || []).forEach(ex => { fixSubst(ex.steps); fix(ex.steps, NAMA_SUB.test(sub)); }));
        });
    });
})();
