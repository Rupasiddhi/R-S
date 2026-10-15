// ==========================================
// BASE URL
// ==========================================
const BASE_URL = "https://buddhist-educational-apps.github.io/B-E-A";

// ==========================================
// බෞද්ධ අධ්‍යාපනික Apps දත්ත
// ==========================================
const appsData = [
  {
    id: 1,
    title: "අභිධර්ම මාතිකා (Matika)",
    developer: "B.E.A • බෞද්ධ අධ්‍යාපනය",
    category: "අභිධර්මය",
    rating: "4.9",
    reviews: "100+",
    size: "15 MB",
    badgeType: "tag-gold",
    description: "අභිධර්ම මාතිකා සහ ධම්මසංගණී විග්‍රහයන් පහසුවෙන් කියවීමට සහ අධ්‍යයනය කිරීමට නිර්මාණය කළ සුවිශේෂී මෘදුකාංගයකි.",
    icon: BASE_URL + "/icons/matika.png",
    apkUrl: "https://apkpure.com/p/app.vercel.matika_snowy.twa",
    webUrl: "https://pavara9803-ctrl.github.io/Matika/",
    screenshots: [
      BASE_URL + "/screenshots/matika-1.webp",
      BASE_URL + "/screenshots/matika-2.webp",
      BASE_URL + "/screenshots/matika-3.webp",
      BASE_URL + "/screenshots/matika-4.webp",
      BASE_URL + "/screenshots/matika-5.webp"
    ],
    installGuide: {
      android: [
        "පහත <strong>\"Install (Play Store)\"</strong> බොත්තම ඔබන්න",
        "එය ඔබව Google Play Store වෙත ගෙන යනු ඇත",
        "<strong>\"Install\"</strong> ඔබන්න",
        "ස්ථාපනය අවසන් වූ පසු <strong>\"Open\"</strong> ඔබන්න",
        "දැන් ඔබගේ Home Screen එකේ අයිකනය දිස්වේ! 🎉"
      ],
      ios: [
        "ඉහළ <strong>\"Online භාවිතය\"</strong> බොත්තම ඔබන්න",
        "Safari browser එකේ යෙදුම විවෘත වේ",
        "පහළ ඇති <strong>Share</strong> බොත්තම (⬆️) ඔබන්න",
        "<strong>\"Add to Home Screen\"</strong> තෝරන්න",
        "<strong>\"Add\"</strong> ඔබන්න - දැන් Home Screen එකේ! 🎉"
      ],
      desktop: [
        "ඉහළ <strong>\"Online භාවිතය\"</strong> බොත්තම ඔබන්න",
        "Address bar එකේ දකුණේ ඇති <strong>install icon</strong> (➕) ඔබන්න",
        "හෝ browser මෙනුවෙන් <strong>\"Install\"</strong> තෝරන්න",
        "<strong>\"Install\"</strong> ඔබන්න - Desktop App එකක් ලෙස දිස්වේ! 🎉"
      ]
    }
  },
  {
    id: 2,
    title: "රූපසිද්ධි (Rupasiddhi)",
    developer: "B.E.A • පාලි ව්‍යාකරණ",
    category: "පාලි භාෂාව",
    rating: "4.8",
    reviews: "50+",
    size: "8 MB",
    badgeType: "tag-blue",
    description: "පදරුපසිද්ධි ග්‍රන්ථය ඇසුරින් පාලි නාම, ආඛ්‍යාත පද සාධනයන් සහ ව්‍යාකරණ සූත්‍ර පහසුවෙන් හදාරන මෘදුකාංගය.",
    icon: BASE_URL + "/icons/ruoasiddhi.png",
    apkUrl: "https://rupasiddhi.vercel.app/",
    webUrl: "https://rupasiddhi.vercel.app/",
    screenshots: [
      BASE_URL + "/screenshots/rupasiddhi-1.webp",
      BASE_URL + "/screenshots/rupasiddhi-2.webp",
      BASE_URL + "/screenshots/rupasiddhi-3.webp",
      BASE_URL + "/screenshots/rupasiddhi-4.webp"
    ],
    installGuide: {
      android: [
        "පහත <strong>\"බාගත කරන්න (APK)\"</strong> බොත්තම ඔබන්න",
        "APK ගොනුව බාගත වේ (Rupasiddhi.apk)",
        "Notifications එකෙන් <strong>\"Install\"</strong> ඔබන්න",
        "හෝ <strong>Settings → Security → Unknown Sources</strong> සක්‍රීය කරන්න",
        "APK ගොනුව ඔබා <strong>\"Install\"</strong> තෝරන්න",
        "දැන් Home Screen එකේ අයිකනය දිස්වේ! 🎉"
      ],
      ios: [
        "ඉහළ <strong>\"Online භාවිතය\"</strong> බොත්තම ඔබන්න",
        "Safari browser එකේ යෙදුම විවෘත වේ",
        "පහළ ඇති <strong>Share</strong> බොත්තම (⬆️) ඔබන්න",
        "<strong>\"Add to Home Screen\"</strong> තෝරන්න",
        "<strong>\"Add\"</strong> ඔබන්න - දැන් Home Screen එකේ! 🎉"
      ],
      desktop: [
        "ඉහළ <strong>\"Online භාවිතය\"</strong> බොත්තම ඔබන්න",
        "Address bar එකේ දකුණේ ඇති <strong>install icon</strong> (➕) ඔබන්න",
        "හෝ browser මෙනුවෙන් <strong>\"Install\"</strong> තෝරන්න",
        "<strong>\"Install\"</strong> ඔබන්න - Desktop App එකක් ලෙස දිස්වේ! 🎉"
      ]
    }
  },
  {
    id: 3,
    title: "බුද්ධ වර්ෂය (Buddhist Era)",
    developer: "B.C • බෞද්ධ දින දර්ශන",
    category: "දින දර්ශනය",
    rating: "4.9",
    reviews: "30+",
    size: "4 MB",
    badgeType: "tag-gold",
    description: "ශ්‍රී බුද්ධ වර්ෂය, පොහොය දින සහ විශේෂ බෞද්ධ දින දර්ශන ස්වයංක්‍රීයව ගණනය කර බලාගැනීමේ මෘදුකාංගය.",
    icon: BASE_URL + "/icons/buddhistera.png",
    apkUrl: "https://play.google.com/store/apps/details?id=app.vercel.buddhist_era.twa",
    webUrl: "https://buddhist-era.vercel.app/",
    screenshots: [
      BASE_URL + "/screenshots/bc-1.webp",
      BASE_URL + "/screenshots/bc-2.webp",
      BASE_URL + "/screenshots/bc-3.webp",
      BASE_URL + "/screenshots/bc-4.webp",
      BASE_URL + "/screenshots/bc-5.webp"
    ],
    installGuide: {
      android: [
        "පහත <strong>\"Install (Play Store)\"</strong> බොත්තම ඔබන්න",
        "එය ඔබව Google Play Store වෙත ගෙන යනු ඇත",
        "<strong>\"Install\"</strong> ඔබන්න - Home Screen එකේ අයිකනය දිස්වේ! 🎉"
      ],
      ios: [
        "ඉහළ <strong>\"Online භාවිතය\"</strong> බොත්තම ඔබන්න",
        "Safari browser එකේ පහළ ඇති <strong>Share</strong> බොත්තම (⬆️) ඔබන්න",
        "<strong>\"Add to Home Screen\"</strong> තෝරන්න - දැන් Home Screen එකේ! 🎉"
      ],
      desktop: [
        "ඉහළ <strong>\"Online භාවිතය\"</strong> බොත්තම ඔබන්න",
        "Address bar එකේ දකුණේ ඇති <strong>install icon</strong> (➕) ඔබන්න",
        "<strong>\"Install\"</strong> තෝරන්න - Desktop App එකක් ලෙස දිස්වේ! 🎉"
      ]
    }
  },
  {
    id: 4,
    title: "පාලි සිංහල ශබ්දකෝෂය (DPSD)",
    developer: "DPSD Team • ශබ්දකෝෂ",
    category: "පාලි ශබ්දකෝෂ",
    rating: "4.9",
    reviews: "45+",
    size: "12 MB",
    badgeType: "tag-blue",
    description: "Digital Pali-Sinhala Dictionary (DPSD) - ත්‍රිපිටක පාලි පාඨ සහ වචනාර්ථ පහසුවෙන් සිංහලෙන් සෙවිය හැකි විද්‍යුත් ශබ්දකෝෂය.",
    icon: BASE_URL + "/icons/palidic.png",
    apkUrl: "https://apkpure.com/ශබ්දකෝෂය/com.pali_sinhala_dictionary.twa",
    webUrl: "https://pali-sinhala-dictionary.github.io/DPSD/",
    screenshots: [
      BASE_URL + "/screenshots/DPSD-1.webp",
      BASE_URL + "/screenshots/DPSD-2.webp",
      BASE_URL + "/screenshots/DPSD-3.webp",
      BASE_URL + "/screenshots/DPSD-4.webp",
      BASE_URL + "/screenshots/DPSD-5.webp"
    ],
    installGuide: {
      android: [
        "පහත <strong>\"බාගත කරන්න (APK)\"</strong> බොත්තම ඔබන්න",
        "Chrome browser එකේ මෙනුවෙන් (⋮) <strong>\"Install App\"</strong> හෝ <strong>\"Add to Home screen\"</strong> තෝරන්න",
        "දැන් Home Screen එකේ යෙදුමක් ලෙස භාවිතා කළ හැක! 🎉"
      ],
      ios: [
        "ඉහළ <strong>\"Online භාවිතය\"</strong> බොත්තම ඔබන්න",
        "Safari browser එකේ පහළ ඇති <strong>Share</strong> (⬆️) ඔබන්න",
        "<strong>\"Add to Home Screen\"</strong> තෝරා <strong>Add</strong> ඔබන්න! 🎉"
      ],
      desktop: [
        "ඉහළ <strong>\"Online භාවිතය\"</strong> බොත්තම ඔබන්න",
        "Address bar එකේ දකුණු පස ඇති Install අයිකනය ඔබන්න",
        "<strong>\"Install\"</strong> ඔබන්න! 🎉"
      ]
    }
  }
];

// ==========================================
// PDF පොත් නාමාවලිය දත්ත
// ==========================================
const booksData = [
  {
    id: 1,
    title: "අභිධර්ම මාතිකා අධ්‍යන ප්‍රවේශය - කඩුවෙල අතුලඤාණ හිමි 2023",
    category: "අභිධර්ම",
    folder: "අභිධර්ම",
    downloads: 0,
    size: "4.3 MB",
    pdfUrl: BASE_URL + "/pdfs/Abhidhamma-matika.pdf",
    countKey: "abhidhamma-matika"
  },
  {
    id: 2,
    title: "අභිධර්ම චිත්තවීථි විනිශ්චය - කඩුවෙල අතුලඤාණ හිමි",
    category: "අභිධර්ම",
    folder: "අභිධර්ම",
    downloads: 0,
    size: "5.7 MB",
    pdfUrl: BASE_URL + "/pdfs/Abhidhamma-cittaveeti.pdf",
    countKey: "abhidhamma-cittaveeti"
  },
  {
    id: 3,
    title: "ධාතුකථා ප්‍රකරණ අධ්‍යයන ප්‍රවේශය - කඩුවෙල අතුලඤාණ හිමි 2023",
    category: "අභිධර්ම",
    folder: "අභිධර්ම",
    downloads: 0,
    size: "5.9 MB",
    pdfUrl: BASE_URL + "/pdfs/Abhidhamma-dhatukata.pdf",
    countKey: "abhidhamma-dhatukata"
  },
  {
    id: 4,
    title: "පට්ඨාන ත්‍රි රාශිය - නාඋයනේ අරියධම්ම හිමි, කඩුවෙල අතුලඤාණ හිමි 2022",
    category: "අභිධර්ම",
    folder: "අභිධර්ම",
    downloads: 0,
    size: "3.3 MB",
    pdfUrl: BASE_URL + "/pdfs/Abhidhamma-patthanathree.pdf",
    countKey: "abhidhamma-pattana3"
  },
  {
    id: 5,
    title: "පට්ඨාන ප්‍රකරණ අධ්‍යයන ප්‍රවේශය - කඩුවෙල අතුලඤාණ හිමි 2024",
    category: "අභිධර්ම",
    folder: "අභිධර්ම",
    downloads: 0,
    size: "12 MB",
    pdfUrl: BASE_URL + "/pdfs/Abhidhamma-patthanaa.pdf",
    countKey: "abhidhamma-pattanaA"
  },
  {
    id: 6,
    title: "පට්ඨාන ප්‍රකරණ අධ්‍යයන ප්‍රවේශය, ශුද්ධ සංඛ්‍යා සහ ස්වරූපාරූඪ - කඩුවෙල අතුලඤාණ හිමි 2023",
    category: "අභිධර්ම",
    folder: "අභිධර්ම",
    downloads: 0,
    size: "1.4 MB",
    pdfUrl: BASE_URL + "/pdfs/Abhidhamma-patthanas.pdf",
    countKey: "abhidhamma-pattanaS"
  },
  {
    id: 7,
    title: "පට්ඨාන මහාපකරණ සන්නය 2 - කඩුවෙල අතුලඤාණ හිමි 2023",
    category: "අභිධර්ම",
    folder: "අභිධර්ම",
    downloads: 0,
    size: "4.3 MB",
    pdfUrl: BASE_URL + "/pdfs/Abhidhamma-patthanamps.pdf",
    countKey: "abhidhamma-pattanaMPS"
  },
  {
    id: 8,
    title: "සමුට්ඨානසීස",
    category: "විනය",
    folder: "විනය",
    downloads: 0,
    size: "2 MB",
    pdfUrl: BASE_URL + "/pdfs/vinaya/Samutthanaseesa.pdf",
    countKey: "vinaya-samutthanaseesa"
  },
  {
    id: 9,
    title: "සප්තදසකාරය",
    category: "විනය",
    folder: "විනය",
    downloads: 0,
    size: "2 MB",
    pdfUrl: BASE_URL + "/pdfs/vinaya/Sapthadasakaraya.pdf",
    countKey: "vinaya-sapthadasakaraya"
  },
  {
    id: 10,
    title: "සීමා",
    category: "විනය",
    folder: "විනය",
    downloads: 0,
    size: "2 MB",
    pdfUrl: BASE_URL + "/pdfs/vinaya/Seema.pdf",
    countKey: "vinaya-seema"
  }
];

// ==========================================
// Render Functions
// ==========================================
function renderContent() {
  renderApps(appsData);
  renderBooks(booksData);
  loadAllDownloadCounts();
}

// ==========================================
// Apps Render කිරීම
// ==========================================
function renderApps(apps) {
  const container = document.getElementById("appsContainer");
  if (!container) return;

  if (apps.length === 0) {
    container.innerHTML = `<div style="padding: 32px; text-align: center; color: var(--text-muted); grid-column: 1/-1;">සොයන ලද යෙදුම හමු නොවීය.</div>`;
    return;
  }

  container.innerHTML = apps.map(app => {
    const isPlayStoreLink = app.apkUrl && app.apkUrl.includes("play.google.com");
    const buttonLabel = isPlayStoreLink ? "Install (Play Store)" : "බාගත කරන්න (APK)";

    const screenshotsHTML = app.screenshots && app.screenshots.length > 0 ? `
      <div class="playstore-screenshots">
        <div class="playstore-screenshots-scroll">
          ${app.screenshots.map((img, index) => `
            <img src="${img}" 
                 alt="${app.title} - Screenshot${index + 1}" 
                 class="playstore-screenshot-img"
                 width="220"
                 height="175"
                 loading="lazy"
                 decoding="async"
                 onclick="event.stopPropagation(); openLightbox('${img}', '${app.title}')">
          `).join("")}
        </div>
      </div>
    ` : "";

    const installGuideHTML = app.installGuide ? `
      <div class="install-guide">
        <button type="button" class="install-guide-toggle" onclick="event.stopPropagation(); toggleInstallGuide(this)" aria-expanded="false">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-gold); flex-shrink: 0;">
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>
          </svg>
          <span class="install-guide-text">යෙදුම ස්ථාපනය කරගන්නා ආකාරය</span>
          <span class="install-guide-arrow"></span>
        </button>
        
        <div class="install-guide-content">
          <div class="install-tabs">
            <button type="button" class="install-tab active" onclick="event.stopPropagation(); switchInstallTab(this, 'android-${app.id}')">
              <svg class="tab-badge-icon" viewBox="0 0 512 512" width="16" height="16" fill="currentColor">
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
              </svg>
              <span>Google Play</span>
            </button>
            
            <button type="button" class="install-tab" onclick="event.stopPropagation(); switchInstallTab(this, 'ios-${app.id}')">
              <svg class="tab-badge-icon" viewBox="0 0 170 170" width="16" height="16" fill="currentColor">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.7-11.64-13.98-5.88-9.13-10.46-19.46-13.73-30.98-3.26-11.52-4.9-22.37-4.9-32.55 0-14.12 3.59-25.99 10.77-35.61 7.18-9.62 16.32-14.53 27.42-14.73 4.9 0 10.12 1.25 15.66 3.75 5.54 2.5 9.14 3.86 10.79 4.08 1.96-.33 5.76-1.79 11.41-4.4 5.65-2.61 10.77-3.81 15.35-3.61 14.79.76 26.24 6.2 34.35 16.31-13.06 7.83-19.48 18.59-19.26 32.28.22 10.66 4.13 19.68 11.74 27.07 7.61 7.39 16.75 11.63 27.41 12.72-2.18 6.42-4.8 12.63-7.85 18.63zM119.22 31.84c0-7.72 2.72-14.9 8.16-21.53 5.44-6.63 12.19-10.77 20.25-12.42.22 1.31.33 2.5.33 3.59 0 7.61-2.83 14.8-8.49 21.55-5.66 6.75-12.51 10.77-20.57 12.07-.11-1.09-.17-2.18-.17-3.26z"/>
              </svg>
              <span>Apple iOS</span>
            </button>
            
            <button type="button" class="install-tab" onclick="event.stopPropagation(); switchInstallTab(this, 'desktop-${app.id}')">
              <svg class="tab-badge-icon" viewBox="0 0 88 88" width="16" height="16" fill="currentColor">
                <path d="M0 12.402l35.688-4.86.016 34.423-35.67.24zM35.67 45.547l.034 35.035-35.67-4.896-.034-30.139zm4.33-48.452L88 0v41.594l-48 .377zm48 44.139L40 81.334V45.717l48 .347z"/>
              </svg>
              <span>Windows PC</span>
            </button>
          </div>

          <div class="install-panel active" id="android-${app.id}">
            <ol class="install-steps">
              ${app.installGuide.android.map(step => `<li>${step}</li>`).join("")}
            </ol>
          </div>

          <div class="install-panel" id="ios-${app.id}">
            <ol class="install-steps">
              ${app.installGuide.ios.map(step => `<li>${step}</li>`).join("")}
            </ol>
          </div>

          <div class="install-panel" id="desktop-${app.id}">
            <ol class="install-steps">
              ${app.installGuide.desktop.map(step => `<li>${step}</li>`).join("")}
            </ol>
          </div>
        </div>
      </div>
    ` : "";

    return `
      <div class="playstore-card" id="app-card-${app.id}">
        <div class="playstore-summary" onclick="toggleAppCard(${app.id})">
          <img src="${app.icon}" alt="${app.title} Icon" class="playstore-app-icon" width="62" height="62" decoding="async" onerror="this.src='favicon.png'">
          <div class="playstore-header-info">
            <h3 class="playstore-app-title">${app.title}</h3>
            <div class="playstore-developer">
              <span>✓</span> ${app.developer || "බෞද්ධ අධ්‍යාපනය"}
            </div>
          </div>
          <span class="card-expand-arrow" aria-hidden="true"></span>
        </div>

        <div class="playstore-details">
          <div class="playstore-meta-row">
            <div class="playstore-meta-item">
              <span class="playstore-meta-val">${app.rating || "4.8"} <span class="star">★</span></span>
              <span class="playstore-meta-lbl">${app.reviews || "Reviews"}</span>
            </div>
            <div class="playstore-meta-divider"></div>
            <div class="playstore-meta-item">
              <span class="playstore-meta-val">${app.size || "10 MB"}</span>
              <span class="playstore-meta-lbl">ප්‍රමාණය</span>
            </div>
            <div class="playstore-meta-divider"></div>
            <div class="playstore-meta-item">
              <span class="playstore-meta-val">3+</span>
              <span class="playstore-meta-lbl">Rated 3+</span>
            </div>
          </div>

          <div class="playstore-actions">
            <a href="${app.apkUrl}" ${app.apkUrl.endsWith('.apk') ? 'download' : 'target="_blank" rel="noopener noreferrer"'} class="btn-playstore-install" onclick="event.stopPropagation()">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              ${buttonLabel}
            </a>
            <a href="${app.webUrl}" target="_blank" rel="noopener noreferrer" class="btn-playstore-web" onclick="event.stopPropagation()">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Online භාවිතය
            </a>
            <button type="button" class="btn-playstore-share" onclick="event.stopPropagation(); shareApp('${app.title}', '${app.webUrl}')" title="යෙදුම බෙදාගන්න" aria-label="Share">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              ශෙයා
            </button>
          </div>

          <p class="playstore-about">${app.description}</p>
          ${screenshotsHTML}
          ${installGuideHTML}
        </div>
      </div>
    `;
  }).join("");
}

// ==========================================
// Share App
// ==========================================
function shareApp(title, url) {
  if (navigator.share) {
    navigator.share({
      title: title,
      text: `${title} - බෞද්ධ අධ්‍යාපනික මෘදුකාංගය:`,
      url: url
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => {
      alert(`"${title}" යෙදුමේ සබැඳිය Copy කරගන්නා ලදී!`);
    }).catch(() => {
      prompt("මෙම සබැඳිය පිටපත් කරගන්න:", url);
    });
  }
}

// ==========================================
// App Card Toggle
// ==========================================
function toggleAppCard(appId) {
  const card = document.getElementById(`app-card-${appId}`);
  if (!card) return;
  card.classList.toggle('expanded');
}

// ==========================================
// Books Table Render කිරීම (දුරකථන මගින් බාගත කිරීමට පහසු වන සේ සකසා ඇත)
// ==========================================
function renderBooks(books) {
  const container = document.getElementById("pdfFileList");
  if (!container) return;

  if (books.length === 0) {
    container.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-muted);">සොයන ලද පොත හමු නොවීය.</div>`;
    return;
  }

  const grouped = {};
  books.forEach(book => {
    const folder = book.folder || "වෙනත්";
    if (!grouped[folder]) grouped[folder] = [];
    grouped[folder].push(book);
  });

  container.innerHTML = Object.keys(grouped).map(folderName => `
    <div class="folder-group">
      <div class="folder-header" onclick="toggleFolder(this)">
        <span class="folder-arrow" aria-hidden="true"></span>
        <span class="folder-icon" aria-hidden="true"></span>
        <span class="folder-name">${folderName}</span>
        <span class="folder-count">${grouped[folderName].length} පොත්</span>
      </div>
      <div class="folder-books" style="display: none;">
        ${grouped[folderName].map(book => `
          <a href="${book.pdfUrl}" 
             download="${book.title}.pdf"
             class="table-row" 
             onclick="handleDownload('${book.countKey}')"
             target="_blank" 
             rel="noopener noreferrer"
             title="${book.title} බාගත කරගන්න">
            <div class="file-col-title">
              <span class="pdf-badge">PDF</span>
              <span class="file-text">${book.title}</span>
            </div>
            <span class="file-col-cat">${book.category}</span>
            <span class="file-col-count" id="count-${book.countKey}">${book.downloads}</span>
            <div class="file-col-size-wrap" style="display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
              <span class="file-col-size">${book.size}</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-gold); flex-shrink: 0;" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
          </a>
        `).join("")}
      </div>
    </div>
  `).join("");
}

function toggleFolder(headerElement) {
  const folderGroup = headerElement.parentElement;
  const folderBooks = folderGroup.querySelector(".folder-books");

  const isOpen = folderGroup.classList.contains("open");

  if (isOpen) {
    folderGroup.classList.remove("open");
    folderBooks.style.display = "none";
  } else {
    folderGroup.classList.add("open");
    folderBooks.style.display = "block";
  }
}

function toggleInstallGuide(button) {
  const content = button.nextElementSibling;
  const isOpen = content.classList.contains("open");
  
  if (isOpen) {
    content.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
  } else {
    content.classList.add("open");
    button.setAttribute("aria-expanded", "true");
  }
}

function switchInstallTab(tabButton, panelId) {
  const tabContainer = tabButton.parentElement;
  tabContainer.querySelectorAll(".install-tab").forEach(t => {
    t.classList.remove("active");
  });
  
  const guideContent = tabButton.closest(".install-guide-content");
  guideContent.querySelectorAll(".install-panel").forEach(p => {
    p.classList.remove("active");
  });
  
  tabButton.classList.add("active");
  const targetPanel = document.getElementById(panelId);
  if (targetPanel) targetPanel.classList.add("active");
}

function openLightbox(imageSrc, title) {
  const existing = document.getElementById("lightbox");
  if (existing) existing.remove();

  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <button type="button" class="lightbox-close" onclick="closeLightbox()" aria-label="වසන්න">&times;</button>
    <img src="${imageSrc}" alt="${title}" class="lightbox-img">
    <p class="lightbox-caption">${title}</p>
  `;
  lightbox.onclick = function(e) {
    if (e.target === lightbox) closeLightbox();
  };
  document.body.appendChild(lightbox);

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeLightbox();
  });
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (lightbox) lightbox.remove();
}

// ==========================================
// Firebase Background Loader & Counts
// ==========================================
let db = null;
const firebaseConfig = {
  apiKey: "AIzaSyDEjIe7xsjQCqcPp2dHpWZufZ-SIM9BXCo",
  authDomain: "buddhist-apps.firebaseapp.com",
  databaseURL: "https://buddhist-apps-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "buddhist-apps",
  storageBucket: "buddhist-apps.firebasestorage.app",
  messagingSenderId: "59827119271",
  appId: "1:59827119271:web:522edb63f4bed3191de782"
};

function initFirebaseAndLoadCounts() {
  if (typeof firebase !== 'undefined') {
    try {
      if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
      db = firebase.database();
      loadAllDownloadCounts();
    } catch(e) {}
    return;
  }

  const appScript = document.createElement('script');
  appScript.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js';
  appScript.onload = function() {
    const dbScript = document.createElement('script');
    dbScript.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js';
    dbScript.onload = function() {
      try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
        loadAllDownloadCounts();
      } catch(e) {}
    };
    document.head.appendChild(dbScript);
  };
  document.head.appendChild(appScript);
}

function loadAllDownloadCounts() {
  if (!db) return;
  booksData.forEach(book => {
    if (book.countKey) getDownloadCount(book.countKey);
  });
}

function getDownloadCount(countKey) {
  if (!db) return;
  db.ref('downloads/' + countKey).once('value')
    .then(snapshot => {
      updateCountDisplay(countKey, snapshot.val() || 0);
    })
    .catch(() => {
      updateCountDisplay(countKey, 0);
    });
}

function incrementDownloadCount(countKey) {
  if (!db || !countKey) return;
  db.ref('downloads/' + countKey).transaction(current => (current || 0) + 1)
    .then(result => {
      if (result.committed) updateCountDisplay(countKey, result.snapshot.val());
    });
}

function updateCountDisplay(countKey, value) {
  const element = document.getElementById(`count-${countKey}`);
  if (element) element.textContent = value;
}

function handleDownload(countKey) {
  if (countKey) incrementDownloadCount(countKey);
}

// ==========================================
// Live Search
// ==========================================
let searchDebounceTimer = null;

function handleSearchInput() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');
  if (!input) return;

  const query = input.value.trim();
  if (clearBtn) {
    if (query.length > 0) clearBtn.classList.remove('hidden');
    else clearBtn.classList.add('hidden');
  }

  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => performSearch(query), 150);
}

function handleSearchFocus() {
  const input = document.getElementById('searchInput');
  if (input && input.value.trim().length > 0) {
    performSearch(input.value.trim());
  }
}

function performSearch(query) {
  const resultsContainer = document.getElementById('searchResults');
  const resultsInner = resultsContainer ? resultsContainer.querySelector('.search-results-inner') : null;
  if (!resultsContainer || !resultsInner) return;

  if (!query || query.length === 0) {
    resultsContainer.classList.add('hidden');
    return;
  }

  const lowerQuery = query.toLowerCase();
  const matchedApps = appsData.filter(app => 
    app.title.toLowerCase().includes(lowerQuery) ||
    app.category.toLowerCase().includes(lowerQuery) ||
    app.description.toLowerCase().includes(lowerQuery)
  );

  const matchedBooks = booksData.filter(book => 
    book.title.toLowerCase().includes(lowerQuery) ||
    book.category.toLowerCase().includes(lowerQuery)
  );

  if (matchedApps.length === 0 && matchedBooks.length === 0) {
    resultsInner.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-dim); font-size: 0.9rem;">ප්‍රතිඵල හමු නොවීය.</div>`;
    resultsContainer.classList.remove('hidden');
    return;
  }

  let html = '';
  if (matchedApps.length > 0) {
    html += `<div class="search-section-title">යෙදුම් (${matchedApps.length})</div>`;
    matchedApps.forEach(app => {
      html += `
        <a href="${app.webUrl}" target="_blank" rel="noopener noreferrer" class="search-result-item">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-gold); flex-shrink: 0;"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>
          <div class="search-result-title">${app.title}</div>
        </a>
      `;
    });
  }

  if (matchedBooks.length > 0) {
    html += `<div class="search-section-title">ග්‍රන්ථ (${matchedBooks.length})</div>`;
    matchedBooks.forEach(book => {
      html += `
        <a href="${book.pdfUrl}" download="${book.title}.pdf" target="_blank" rel="noopener noreferrer" class="search-result-item" onclick="handleDownload('${book.countKey}')">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--pdf-red); flex-shrink: 0;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <div class="search-result-title">${book.title}</div>
        </a>
      `;
    });
  }

  resultsInner.innerHTML = html;
  resultsContainer.classList.remove('hidden');
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');
  const resultsContainer = document.getElementById('searchResults');
  if (input) {
    input.value = '';
    input.focus();
  }
  if (clearBtn) clearBtn.classList.add('hidden');
  if (resultsContainer) resultsContainer.classList.add('hidden');
}

document.addEventListener('click', event => {
  const searchWrapper = document.querySelector('.search-wrapper');
  const resultsContainer = document.getElementById('searchResults');
  if (searchWrapper && resultsContainer && !searchWrapper.contains(event.target)) {
    resultsContainer.classList.add('hidden');
  }
});

// Global Scope Bindings
window.shareApp = shareApp;
window.toggleAppCard = toggleAppCard;
window.toggleFolder = toggleFolder;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.handleDownload = handleDownload;
window.toggleInstallGuide = toggleInstallGuide;
window.switchInstallTab = switchInstallTab;
window.handleSearchInput = handleSearchInput;
window.handleSearchFocus = handleSearchFocus;
window.clearSearch = clearSearch;

// ==========================================
// 1. ක්ෂණිකව UI පෙන්වීම (Fast Paint)
// ==========================================
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", renderContent);
} else {
  renderContent();
}

// ==========================================
// 2. පිටුව දර්ශනය වූ පසු Background එකෙන් Firebase ක්‍රියාත්මක කිරීම
// ==========================================
if (window.requestIdleCallback) {
  window.requestIdleCallback(initFirebaseAndLoadCounts);
} else {
  window.addEventListener('load', initFirebaseAndLoadCounts);
}