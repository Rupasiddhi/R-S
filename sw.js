// ==========================================================================
// පද රූපසිද්ධි සංහිතා - Service Worker
// --------------------------------------------------------------------------
// උපාය මාර්ගය: Stale-While-Revalidate
//   • Cache එකේ ඇති පිටපත වහාම ලබාදේ (offline හා වේගවත්).
//   • එම අවස්ථාවේම පසුබිමින් network එකෙන් අලුත් පිටපත ලබාගෙන cache යාවත්කාලීන කරයි.
//   • එබැවින් දත්ත ගොනුවක් වෙනස් කළ විට, පරිශීලකයාට ඊළඟ විවෘත කිරීමේදී අලුත් අන්තර්ගතය පෙනේ.
// නව ගොනුවක් index.html වෙත එක් කරන විට එය ASSETS_TO_CACHE ලැයිස්තුවටද එක් කරන්න.
// ==========================================================================

const CACHE_NAME = 'pada-rupasiddhi-v14.1.0';
const FONT_CACHE = 'pada-rupasiddhi-fonts-v1';

// Offline භාවිතය සඳහා Cache කරගත යුතු සියලුම අත්‍යවශ්‍ය ගොනු ලැයිස්තුව
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',

  // Stylesheets
  './css/themes.css',
  './css/main.css',
  './css/shadakara.css',
  './css/sanna.css',
  './css/sara.css',
  './css/byanjana.css',
  './css/niggahita.css',
  './css/pakati.css',
  './css/nama.css',
  './css/pada-sadhana.css',
  './css/karaka.css',
  './css/settings.css',

  // Core & View Scripts
  './js/app.js',
  './js/settings.js',
  './js/shadakara-view.js',
  './js/sanna-view.js',
  './js/sara-view.js',
  './js/byanjana-view.js',
  './js/niggahita-view.js',
  './js/pakati-view.js',
  './js/nama-view.js',
  './js/pada-sadhana-view.js',
  './js/karaka-view.js',

  // Data Files
  './data/0_shadakara_intro/shadakara_details.js',
  './data/1_sandhi/01_sanna.js',
  './data/1_sandhi/02_sara.js',
  './data/1_sandhi/03_byanjana.js',
  './data/1_sandhi/04_niggahita.js',
  './data/1_sandhi/05_pakati.js',
  './data/2_nama/01_pullinga.js',
  './data/2_nama/01b_pullinga_sadhana.js',
  './data/2_nama/01c_pullinga_saddaniti.js',
  './data/2_nama/02_itthilinga.js',
  './data/2_nama/02b_itthilinga_sadhana.js',
  './data/2_nama/02c_itthilinga_saddaniti.js',
  './data/2_nama/03_napumsakalinga.js',
  './data/2_nama/03b_napumsakalinga_sadhana.js',
  './data/2_nama/03c_napumsakalinga_saddaniti.js',
  './data/2_nama/04_sabbanama.js',
  './data/2_nama/04b_sabbanama_sadhana.js',
  './data/2_nama/05_alinga.js',
  './data/2_nama/05b_alinga_sadhana.js',
  './data/2_nama/06_vibhattippaccaya.js',
  './data/2_nama/07_abyaya.js',
  './data/3_karaka/00_karaka_intro.js',
  './data/3_karaka/01_karaka_pathama.js',
  './data/3_karaka/02_karaka_dutiya.js',
  './data/3_karaka/03_karaka_tatiya.js',
  './data/3_karaka/04_karaka_catutthi.js',
  './data/3_karaka/05_karaka_pancami.js',
  './data/3_karaka/06_karaka_chatthi.js',
  './data/3_karaka/07_karaka_sattami.js',

  // Icons
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable.png'
];

// 1. Install: සියලු ගොනු Cache කිරීම
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// 2. Activate: පැරණි Caches ඉවත් කිරීම
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names
        .filter((name) => name !== CACHE_NAME && name !== FONT_CACHE)
        .map((name) => caches.delete(name))
    )).then(() => self.clients.claim())
  );
});

// Google Fonts (වෙනත් origin) - cache-first, offline තුළද සිංහල අකුරු නිවැරදිව පෙන්වීමට
function isFontRequest(url) {
  return url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
}

// 3. Fetch
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (isFontRequest(url)) {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) =>
        cache.match(request).then((cached) => cached || fetch(request).then((response) => {
          if (response && (response.ok || response.type === 'opaque')) {
            cache.put(request, response.clone());
          }
          return response;
        }))
      )
    );
    return;
  }

  // වෙනත් origin ඉල්ලීම් browser එකටම භාර දීම
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request, { ignoreSearch: true }).then((cached) => {
        const networkFetch = fetch(request).then((response) => {
          if (response && response.ok && response.type === 'basic') {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(() => {
          // Offline: පිටු ඉල්ලීමකට මූලික පිටුව ලබාදීම
          if (request.mode === 'navigate') {
            return cache.match('./index.html');
          }
          return undefined;
        });

        if (cached) {
          // පසුබිමින් යාවත්කාලීන කිරීම (Service worker නැවතීමට පෙර අවසන් වීමට ඉඩ දීම)
          event.waitUntil(networkFetch.catch(() => {}));
          return cached;
        }
        return networkFetch.then((response) => response || Response.error());
      })
    )
  );
});
