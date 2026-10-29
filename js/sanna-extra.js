/**
 * සන්ධි / නාම කණ්ඩ — ෂඩාකාරයට පහළින් "සන්නය" කාඩ්පත (රූපසිද්ධි පාඨය + පදයෙන් පද සන්නය),
 * ටීකා විවරණ හා විශේෂ සටහන් (data/1_sandhi/sandhi_tika.js, data/2_nama/nama_tika.js ආදිය)
 */
function extraTikaList(s) {
    const n = s.sutta_number;
    return ((window.SandhiTika || {})[n] || []).concat((window.NamaTika || {})[n] || []);
}
function extraNotesList(s) {
    const n = s.sutta_number;
    return ((window.SandhiSuttaNotes || {})[n] || []).concat((window.NamaSuttaNotes || {})[n] || []);
}

function renderExtraSanna(s) {
    const list = extraTikaList(s);
    const rupa = list.filter(t => t.kind === 'rupa');
    const tika = list.filter(t => t.kind !== 'rupa');
    const notes = extraNotesList(s);
    const ext = s.extended_commentary;
    let html = '';

    if (rupa.length || ext) {
        html += `
        <div class="panel-card sara-rupa-sanna-card">
            <h3 class="section-heading"><span class="heading-icon">📖</span> සන්නය <span class="kk-tika-hint">(රූපසිද්ධි විවරණය — පදයෙන් පද සන්නය)</span></h3>
            ${rupa.map(t => `
                <div class="sara-vutti-container sara-rupa-item">
                    ${t.title ? `<span class="sara-rupa-title">${t.title}</span>` : ''}
                    ${t.pali ? `<span class="vutti-label">රූපසිද්ධි පාඨය (පාළි):</span><div class="sara-vutti-text kk-html">${t.pali}</div>` : ''}
                    ${t.pali && t.sanna ? `<hr class="sara-sanna-divider">` : ''}
                    ${t.sanna ? `<span class="vutti-label">පදයෙන් පද සන්නය:</span><div class="sara-sanna-text kk-html kk-pair-sanna">${t.sanna}</div>` : ''}
                </div>`).join('')}
            ${ext ? `<div class="sara-vutti-container sara-rupa-item"><span class="vutti-label">සන්න, ටීකා හා න්‍යාස විවරණ:</span><div class="sara-sanna-text kk-html">${/<\w+/.test(ext) ? ext : `<p>${ext}</p>`}</div></div>` : ''}
        </div>`;
    }
    if (tika.length) {
        html += `
        <section class="panel-card kkn-panel">
            <h3 class="section-heading"><span class="heading-icon">📜</span> ටීකා විවරණ <span class="kk-tika-hint">(${tika.length}) — බැලීමට ක්ලික් කරන්න</span></h3>
            ${tika.map(t => `
                <details class="kk-tika"><summary><span class="kk-tika-icon">📜</span> ${t.source ? `<b>${t.source}</b> — ` : ''}${t.title}</summary>
                    <div class="kk-tika-body"><div class="sanna-vutti-box kk-pair">
                        ${t.pali ? `<span class="vutti-label">ටීකා පාඨය:</span><div class="sanna-vutti-text kk-html">${t.pali}</div>` : ''}
                        ${t.pali && t.sanna ? `<hr class="sanna-sanna-divider">` : ''}
                        ${t.sanna ? `<span class="vutti-label">පදයෙන් පද සන්නය:</span><div class="sanna-sanna-text kk-html kk-pair-sanna">${t.sanna}</div>` : ''}
                    </div></div>
                </details>`).join('')}
        </section>`;
    }
    if (notes.length) {
        html += `
        <section class="panel-card kkn-panel">
            <h3 class="section-heading"><span class="heading-icon">📝</span> විශේෂ සටහන් <span class="kk-tika-hint">(${notes.length}) — බැලීමට ක්ලික් කරන්න</span></h3>
            ${notes.map(n => `
                <details class="kk-tika sn-note"><summary><span class="kk-tika-icon">📝</span> <b>සටහන ${n.n}</b> — ${n.title}</summary>
                    <div class="kk-tika-body">
                        ${n.context ? `<div class="sanna-vutti-box kk-pair"><span class="vutti-label">අදාළ ඡේදය:</span><div class="sanna-vutti-text kk-html">${n.context}</div></div>` : ''}
                        <div class="kkn-body kk-notes-body" style="margin-top:0.6rem"><span class="vutti-label">සටහන:</span>${n.html}</div>
                    </div>
                </details>`).join('')}
        </section>`;
    }
    return html;
}
