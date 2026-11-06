// කිබ්බිධාන හැඳින්වීම — කිතක කාණ්ඩයේ සාරාංශය (නිර්මාණශීලී සටහන්)
(function () {
    const chip = (p, n) => `<li class="ki-pc"><span class="ki-pc-name">${p}</span>${n ? `<span class="ki-pc-note">${n}</span>` : ''}</li>`;
    const list = a => `<ul class="ki-pc-list">${a.map(x => chip(x[0], x[1])).join('')}</ul>`;
    const eg = (pali, sinh) => `<div class="ki-eg"><div class="ki-eg-pali">${pali}</div>${sinh ? `<div class="ki-eg-sinh">${sinh}</div>` : ''}</div>`;
    const eq = parts => `<div class="ki-eq">${parts.map(p => p === '+' || p === '=' ? `<span class="ki-op">${p}</span>` : `<span class="ki-term">${p}</span>`).join('')}</div>`;

    const TEKALIKA = [
        ['ණ', 'උපපද කර්මයක් සහිත'], ['ණ්වු, තු, ආවී, අ', ''], ['ණ', 'උපපද රහිතව, ශුද්ධ ධාතුවටම'], ['ණ', 'භාවකාරකයේ පමණි'],
        ['ක්වි', ''], ['ණී, තු, ආවී', 'තස්සීලාදී අරුත්හි'], ['යු', 'සද්ද කුධ චල …'], ['රූ', 'පාරාදිගමිම්හා'], ['රූ', 'භික්ඛාදිතො'],
        ['තබ්බ, අනීය, ණ්‍ය, තෙය්‍ය, රිච්ච', 'කිච්ච ප්‍රත්‍යය — භාවකම්මෙසු කිච්චා; පෙසාතිසග්ගපත්තකාලෙසු කිච්චා; අරහසක්කත්ථදීපකා'],
        ['යු', 'නන්දාදීහි — භාවකම්මෙසු'], ['යු', 'කත්තු, කරණ, සම්පදාන, අපාදාන, ආධාර']
    ];
    const ATEKALIKA = [
        ['ඉ', 'සඤ්ඤායං දාධාතො'], ['අ, ති, යු', ''], ['ඛ', ''], ['ථ, ම', ''], ['ක්වි', 'ඉයතමකිඑසාන …'],
        ['ත, තවන්තු, තාවී', 'නිට්ඨා'], ['ත', 'භාව-කම්මෙසු'], ['ත', 'කත්තරි — තෙකාලික'],
        ['මාන, අන්ත', 'වත්තමාන'], ['ස්සං, න්තු, මාන, ආන', 'අනාගත ආදිය'], ['කාර', 'අක්ඛරෙහි & ධාතුතො සකත්ථෙ ඉ, ති'],
        ['තවෙ, තුං', 'කත්තරි'], ['තුං', 'අරහ, සක්කාදීසු'], ['තූන, ත්වාන, ත්වා', 'පූර්වකාලික'], ['ක්ඛත්තුං', 'වාරාර්ථ — සංඛ්‍යා ශබ්දය + ක්ඛත්තුං']
    ];

    const rows = [
        ['පු.ලි. ඒක.', 'තෙන සූදෙන ඔදනො පචිතබ්බො.', 'ඒ අරක්කැමියා විසින් බත පිසිය යුතුය.'],
        ['පු.ලි. බහු.', 'තෙන සූදෙන ඔදනා පචිතබ්බා.', 'ඒ අරක්කැමියා විසින් බත්හු පිසිය යුත්තාහු.'],
        ['ඉ.ලි. ඒක.', 'තෙන සූදෙන යාගු පචිතබ්බා.', 'ඒ අරක්කැමියා විසින් කැඳ පිසිය යුතුය.'],
        ['ඉ.ලි. බහු.', 'තෙන සූදෙන යාගුයො පචිතබ්බායො.', 'ඒ අරක්කැමියා විසින් කැඳ පිසිය යුත්තාහු.'],
        ['න.ලි. ඒක.', 'තෙන සූදෙන භත්තං පචිතබ්බං.', 'ඒ අරක්කැමියා විසින් බත පිසිය යුතුය.'],
        ['න.ලි. බහු.', 'තෙන සූදෙන භත්තානි පචිතබ්බානි.', 'ඒ අරක්කැමියා විසින් බත්හු පිසිය යුත්තාහු.']
    ];
    const ADESA = [
        ['දකාරාන්ත', 'ද් + ය', 'ජ්ජ', '√වද + ණ්‍ය', 'වජ්ජ'],
        ['මකාරාන්ත', 'ම් + ය', 'ම්ම', '√ගම + ණ්‍ය', 'ගම්ම'],
        ['ජකාරාන්ත', 'ජ් + ය', 'ග්ග', '√යුජ + ණ්‍ය', 'යොග්ග'],
        ['හකාරාන්ත', 'හ් + ය', 'ය්හ', '√ගරහ + ණ්‍ය', 'ගාරය්හ'],
        ['ආකාරාන්ත', 'ආ + ය', 'එය්‍ය', '√පා + ණ්‍ය', 'පෙය්‍ය']
    ];

    window.renderKitakaIntro = function (s) {
        if (!s || s.sub_khanda_id !== '00_kitaka_intro') return '';
        return `
<div class="panel-card ki-card">
  <h3 class="section-heading"><span class="heading-icon">🗂️</span> කිතක ප්‍රත්‍යය වර්ග</h3>
  <p class="ki-lead">ධාතුවට කිත් ප්‍රත්‍යය යෙදීමෙන් සෑදෙන පද <b>කිතක</b> නම් වේ. ඒවා කාල තුනටම (අතීත, වර්තමාන, අනාගත) යෙදෙන <b>තෙකාලික</b> කිතක සහ එසේ නොවන කිතක ලෙස දෙයාකාරයි.</p>
  <div class="ki-cols">
    <div class="ki-col ki-col-a"><div class="ki-col-head">තෙකාලික කිතක</div>${list(TEKALIKA)}</div>
    <div class="ki-col ki-col-b"><div class="ki-col-head">තෙකාලික නොවන කිතක</div>${list(ATEKALIKA)}</div>
  </div>
</div>

<div class="panel-card ki-card">
  <h3 class="section-heading"><span class="heading-icon">⚖️</span> කිච්ච ප්‍රත්‍යය — භාව හා කර්ම කාරක</h3>
  <div class="ki-chips"><span>තබ්බ</span><span>අනීය</span><span>ණ්‍ය</span><span>තෙය්‍ය</span><span>රිච්ච</span></div>
  <p class="ki-lead">“කළ යුතු / විය යුතු” යන අරහාර්ථය ද “කළ හැකි” යන සක්කාර්ථය ද මේවායින් දැක්වේ (<i>තබ්බ</i> — සුදුසුයි, යුතුයි යන අරහාර්ථයත්, හැකියි යන ශක්‍යාර්ථයත් ඇත).</p>

  <div class="ki-pair">
    <div class="ki-box ki-box-bhava">
      <div class="ki-box-tag">භාවකාරක</div>
      ${eq(['අකර්මක ධාතුව', '+', 'ඉ', '+', 'තබ්බ'])}
      ${eq(['√භූ → භව', '+', 'ඉ', '+', 'තබ්බ', '=', 'භවිතබ්බං (නපුං.)'])}
      ${eg('තෙන රුක්ඛෙන භවිතබ්බං.', 'එය ගසක් විය යුතුය.')}
      ${eg('චොරෙන ච නාම සීලාචාරයුත්තෙන න භවිතබ්බං, කක්ඛළෙන ඵරුසෙන සාහසිකෙන භවිතබ්බන්ති.', 'මහිළාමුඛ ජා.අ.')}
      ${eg('තෙන පඤ්ඤෙන භවිතබ්බං, භවනීයං.', 'හෙතෙම ප්‍රාඥයෙකු විය යුතුය.')}
    </div>
    <div class="ki-box ki-box-kamma">
      <div class="ki-box-tag">කර්මකාරක</div>
      ${eq(['සකර්මක ධාතුව', '+', 'ඉ', '+', 'තබ්බ'])}
      ${eq(['√පච', '+', 'ඉ', '+', 'තබ්බ', '=', 'පචිතබ්බො (තිලිඟු)'])}
      <p class="ki-small">කර්ම ශබ්දයේ ලිංග, වචන අනුව කිතක පදය ද වෙනස් වේ:</p>
    </div>
  </div>

  <div class="ki-table-wrap"><table class="ki-table">
    <thead><tr><th>ලිංග / වචන</th><th>උදාහරණය</th><th>අර්ථය</th></tr></thead>
    <tbody>${rows.map(r => `<tr><td>${r[0]}</td><td class="ki-pali">${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody>
  </table></div>

  <div class="ki-box ki-box-wide">
    <div class="ki-box-tag">කර්මකාරක — ලිංග තුනෙහිම</div>
    ${eg('අභිභවිතබ්බො කොධො පණ්ඩිතෙන, අභිභවිතබ්බා තණ්හා, අභිභවිතබ්බං දුක්ඛං; එවං අභිභවනීයො, අභිභවනීයා, අභිභවනීයං.', 'රූ.සි.')}
    <div class="ki-triple">
      <div><span class="ki-tri-agent">තෙන පණ්ඩිතෙන</span><span class="ki-tri-obj">කොධො</span><span class="ki-tri-res">අභිභවිතබ්බො, අභිභවනීයො</span><em>ඒ නුවණැත්තා විසින් ක්‍රෝධය මැඩලිය යුතුය / හැකිය.</em></div>
      <div><span class="ki-tri-agent">තෙන පණ්ඩිතෙන</span><span class="ki-tri-obj">තණ්හා</span><span class="ki-tri-res">අභිභවිතබ්බා, අභිභවනීයා</span></div>
      <div><span class="ki-tri-agent">තෙන පණ්ඩිතෙන</span><span class="ki-tri-obj">දුක්ඛං</span><span class="ki-tri-res">අභිභවිතබ්බං, අභිභවනීයං</span></div>
    </div>
  </div>
</div>

<div class="panel-card ki-card">
  <h3 class="section-heading"><span class="heading-icon">🔎</span> කිච්ච ප්‍රත්‍යය එකින් එක</h3>
  <div class="ki-grid">
    <div class="ki-mini"><div class="ki-mini-head">අනීය <small>කරණීය — කළ යුතු</small></div>
      ${eg('යං ආනන්ද, සත්ථාරා කරණීයං සාවකානං හිතෙසිනා අනුකම්පකෙන අනුකම්පං උපාදාය, කතං වො තං මයා.', 'සං.නි.')}</div>
    <div class="ki-mini"><div class="ki-mini-head">තෙය්‍ය <small>ඤාතෙය්‍යං — දත යුතු / දැකිය හැකි</small></div>
      ${eg('නාහං තං ගමනෙන ලොකස්ස අන්තං ඤාතෙය්‍යං දට්ඨෙය්‍යං පත්තෙය්‍යන්ති වදාමි.', 'සං.නි.')}</div>
    <div class="ki-mini"><div class="ki-mini-head">රිච්ච <small>කිච්ච — කළ යුත්ත</small></div>
      ${eg('කිච්චං නෙසං කරිස්සාමි, කුලවංසං ඨපෙස්සාමි.', 'දී.නි. සිඞ්ගාලොවාදසුත්ත')}</div>
  </div>

  <h4 class="ki-sub">ණ්‍ය (ණ් + ය) — කාරිය · කළ යුතු</h4>
  <p class="ki-small">ඇතැම් ධාතුවල ධාත්වන්තය හා ප්‍රත්‍යයට සංයුක්තව වෙනත් ආදේශයක් වේ:</p>
  <div class="ki-table-wrap"><table class="ki-table ki-adesa">
    <thead><tr><th>ධාත්වන්තය</th><th>ධාත්වන්ත + ය</th><th>ආදේශය</th><th>සාධනය</th></tr></thead>
    <tbody>${ADESA.map(a => `<tr><td>${a[0]}</td><td class="ki-pali">${a[1]}</td><td class="ki-pali ki-arrow">➔ <b>${a[2]}</b></td><td class="ki-pali">${a[3]} = <b>${a[4]}</b></td></tr>`).join('')}</tbody>
  </table></div>
</div>

<div class="panel-card ki-card">
  <h3 class="section-heading"><span class="heading-icon">⏳</span> මාන හා අන්ත ප්‍රත්‍යය</h3>
  <div class="ki-table-wrap"><table class="ki-table">
    <thead><tr><th>ප්‍රත්‍යය</th><th>කාරක</th><th>උදාහරණ</th></tr></thead>
    <tbody>
      <tr><td class="ki-pali"><b>මාන</b></td><td>කර්තෘ / කර්ම / භාව</td><td class="ki-pali">පචමානො (පිසයි) · පච්චමානො (පිසිනු ලබයි) · පච්චමානං (පිසීම)</td></tr>
      <tr><td class="ki-pali"><b>අන්ත</b></td><td>කර්තෘ</td><td class="ki-pali">පචන්තො (පිසයි)</td></tr>
    </tbody>
  </table></div>
  ${eg('සො දුක්ඛං සහති → සො දුක්ඛං සහමානො', 'කර්තෘ කාරක')}
  ${eg('තෙන දුක්ඛං සය්හති → තෙන දුක්ඛං සය්හමානො', 'කර්ම කාරක')}
</div>

<div class="panel-card ki-card">
  <h3 class="section-heading"><span class="heading-icon">🔀</span> ත ප්‍රත්‍යයයෙහි විකාර</h3>
  <div class="ki-grid">
    <div class="ki-mini"><div class="ki-mini-head">ධ / භ අන්ත ධාතුව + ත</div>
      ${eq(['ධ / භ', '+', 'ත', '=', 'ධ'])}
      ${eq(['ඪ / හ', '+', 'ත', '=', 'ඪ'])}</div>
    <div class="ki-mini"><div class="ki-mini-head">පෙර අකුර</div>
      ${eq(['හ / ඝ / ඣ / ඪ / ධ / භ', '+', 'ධ', '→', 'ද් + ධ'])}
      ${eq(['හ / ඝ / ඣ / ඪ / ධ / භ', '+', 'ඪ', '→', 'ඩ් + ඪ'])}</div>
    <div class="ki-mini"><div class="ki-mini-head">ත → ඉන්න · අන්න · ඊන</div>
      <p class="ki-small">ත ප්‍රත්‍යයට ඉන්න, අන්න, ඊන ආදේශ වේ.</p></div>
  </div>
  ${eg('පුරිසෙන මිගො බජ්ඣීයිත්ථ = පුරිසෙන මිගො බද්ධො', 'ඒ පුරුෂයා විසින් මුවා බඳිනු ලැබීය')}
  ${eg('සො රුක්ඛං ආරුහි = සො රුක්ඛං ආරුළ්හො', 'හෙතෙම ගසට නැග්ගේය')}
</div>`;
    };
})();
