/**
 * උපසග්ග (අව්‍යය) පද සාධනයේ සූත්‍ර හිස්ව තිබූ පියවර සඳහා සූත්‍ර / පියවර වර්ගය පුරවයි.
 * කාර්යය: rule හිස් ("-") පියවර පමණක් සාදයි; දැනටමත් සූත්‍රයක් ඇති පියවර නොවෙනස් කරයි.
 */
(function () {
    var db = window.SuttaDatabase && window.SuttaDatabase['07_abyaya'];
    if (!db) return;
    var empty = function (r) { return !r || !String(r).trim() || /^[-–—]$/.test(String(r).trim()); };
    var R = {
        double: 'පරද්වෙභාවො ඨානෙ.',
        agama: 'ය ව ම ද න ත ර ලා චාගමා.',
        oava: 'ඔ අවස්ස.',
        rassa: 'රස්සං.',
        vagga: 'වග්ගන්තං වා වග්ගෙ.',
        mada: 'මදා සරෙ.',
        avo: 'ක්වචි ඔ බ්‍යඤ්ජනෙ.',
        meaning: 'අර්ථ විග්‍රහය (සූත්‍ර සාධනයක් නොවේ)',
        split: 'පද විච්ඡේදය (උපසර්ගය + ධාතු/පදය)'
    };
    function pick(f, i, n) {
        var t = String(f);
        if (/\(\s*[රයවමදනතල]්\s*\)/.test(t) && !/√/.test(t)) return R.agama;      // (ර්) ආගමය
        if (/ඔ\s*අව/.test(t)) return R.oava;                                       // ඔ → අව
        if (/([කගචජටඩතදපබමයරලවස])්\s*→\s*\1්\1්|([කගචජටඩතදපබමයරලවස])්\s*→\s*[බ]්\s*→\s*[බ]්[බ]්/.test(t)) return R.double; // ද්විත්වය
        if (/සං\s*→\s*[මන]්\s*\+\s*[පඵබභමධඝ]/.test(t)) return R.vagga;           // සං → ම්/න් (වග්ග ව්‍යඤ්ජන පෙර)
        if (/සං\s*→\s*ම්\s*\+\s*[අආඉඊඋඌඑඔ]/.test(t)) return R.mada;              // සං → ම් (ස්වර පෙර)
        if (/අව\s*→\s*ඔ/.test(t)) return R.avo;                                      // අව → ඔ
        if (/[ආ]\s*→\s*අ/.test(t)) return R.rassa;                                  // ආ → අ (රස්ස)
        if (i === 0 && !/[+√→]/.test(t)) return R.meaning;                          // අර්ථ විග්‍රහය
        if (/^\s*\[?[^→]*\+[^→]*\]?\s*$/.test(t) && !/්-|්\s-/.test(t)) return R.split; // සරල විච්ඡේදය
        return null;
    }
    db.forEach(function (s) {
        (s.examples || []).forEach(function (e) {
            (e.steps || []).forEach(function (st, i, a) {
                if (!empty(st.rule) || i === a.length - 1) return;
                var r = pick(st.formula, i, a.length);
                if (r) st.rule = r;
            });
        });
    });
})();
