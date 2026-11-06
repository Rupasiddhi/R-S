// ==========================================================================
// 60. ජිනවචනයුත්තං හි — මතු සියලු සූත්‍රවලට අදාළ අධිකාර සූත්‍රය
// නාමඛාණ්ඩයේ (පුල්ලිඞ්ගං) පළමු සූත්‍රය වන මෙය, කාරක/සමාස/තද්ධිත/ආඛ්‍යාත/කිබ්බිධාන
// ඛාණ්ඩවල පද සාධනයේ මුලටම පෙන්වයි (එකම දත්ත පිටපතක් නැවත භාවිත කරයි).
// ==========================================================================
(function () {
    const db = window.SuttaDatabase || {};
    const src = (db['01_pullinga'] || []).find(s => s.sutta_number === 60);
    if (!src) return;

    const TARGETS = [
        { id: '00_karaka_intro',      name: 'කාරක හැඳින්වීම',        karaka: true },
        { id: '01_samasa_abyayibhava', name: 'අබ්‍යයීභාව සමාස' },
        { id: '01_taddhita_apacca',    name: 'අපච්චාර්ථ තද්ධිත' },
        { id: '00_akhyata_intro',      name: 'ආඛ්‍යාත හැඳින්වීම' },
        { id: '00_kitaka_intro',       name: 'කිබ්බිධාන හැඳින්වීම' }
    ];

    TARGETS.forEach(t => {
        const list = db[t.id];
        if (!list || list.some(s => s.is_adhikara_ref)) return;
        const e = Object.assign({}, src, {
            sub_khanda_id: t.id,
            sub_khanda_name: t.name,
            sutta_type: 'අධිකාර සූත්‍රය (සියලු ඛාණ්ඩවලට පොදුයි)',
            is_adhikara_ref: true,
            examples: []
        });
        if (t.karaka) {
            e.pali = 'ජිනවචනයුත්තං හි.';
            e.role = 'අධිකාර සූත්‍රය';
            e.meaning = src.sutta_meaning;
            e.head_notes = [];
            e.paras = [{ html: src.vutti, sanna: [{ kind: 'sanna', html: src.vutti_sanna }], notes: [], heads: [] }];
        }
        list.unshift(e);
    });
})();
