// `npx cap add android` මගින් සාදන Android project එකට සැකසුම් යොදයි:
//  • ආරම්භක තිරය (splash)   • versionCode / versionName   • keystore ඇත්නම් release signing
// (අයිකන workflow එකේ "Launcher icons" පියවරෙන් සාදයි)
import { readFileSync, writeFileSync, copyFileSync, readdirSync, rmSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(here, '..', 'android', 'app');
const resDir = join(appDir, 'src', 'main', 'res');
const must = (ok, msg) => { if (!ok) throw new Error('patch-android: ' + msg); };
must(existsSync(appDir), 'android/app not found — run `npx cap add android` first');

// 1) Capacitor ගේ පෙරනිමි splash.png ඉවත් කර, අපගේ splash.xml + අයිකනය යොදයි
for (const d of readdirSync(resDir)) {
  const f = join(resDir, d, 'splash.png');
  if (d.startsWith('drawable') && existsSync(f)) rmSync(f);
}
mkdirSync(join(resDir, 'drawable-nodpi'), { recursive: true });
copyFileSync(resolve(here, '..', '..', 'icons', 'rs-512.png'), join(resDir, 'drawable-nodpi', 'splash_icon.png'));
writeFileSync(join(resDir, 'drawable', 'splash.xml'), `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background" />
    <item android:width="160dp" android:height="160dp" android:gravity="center">
        <bitmap android:gravity="fill" android:src="@drawable/splash_icon" />
    </item>
</layer-list>
`);
writeFileSync(join(resDir, 'values', 'ic_launcher_background.xml'), `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#6B1D2F</color>
    <color name="splash_background">#FAF6EE</color>
</resources>
`);

// 2) app/build.gradle: අනුවාදය + signing
const gf = join(appDir, 'build.gradle');
let g = readFileSync(gf, 'utf8');
const run = parseInt(process.env.GITHUB_RUN_NUMBER || '0', 10);
const vCode = parseInt(process.env.VERSION_CODE || String(1 + run), 10);
const vName = process.env.VERSION_NAME || '1.0.0';
must(/versionCode\s*=?\s*\d+/.test(g), 'versionCode not found');
g = g.replace(/versionCode(\s*=?\s*)\d+/, `versionCode$1${vCode}`).replace(/versionName(\s*=?\s*)"[^"]*"/, `versionName$1"${vName}"`);
if (!g.includes('signingConfigs')) {
  must(/buildTypes\s*\{/.test(g), 'buildTypes not found');
  g = g.replace(/(\n\s*)buildTypes\s*\{/, `$1signingConfigs {
        release {
            if (System.getenv("KS_FILE")) {
                storeFile = file(System.getenv("KS_FILE"))
                storePassword = System.getenv("KS_PASS")
                keyAlias = System.getenv("KS_ALIAS")
                keyPassword = System.getenv("KS_KEY_PASS")
            }
        }
    }$1buildTypes {`);
  must(/buildTypes\s*\{\s*release\s*\{/.test(g), 'buildTypes.release not found');
  g = g.replace(/(buildTypes\s*\{\s*release\s*\{)/, `$1\n            if (System.getenv("KS_FILE")) { signingConfig = signingConfigs.release }`);
  // debug (පරීක්ෂණ) ඇප් එක release එක ඉවත් නොකර වෙනම install කළ හැකි වීමට
  if (!/\bdebug\s*\{/.test(g)) g = g.replace(/(buildTypes\s*\{)/, `$1\n        debug {\n            applicationIdSuffix = ".debug"\n            versionNameSuffix = "-test"\n        }`);
}
writeFileSync(gf, g);
console.log(`patched: versionCode=${vCode} versionName=${vName}, signing=${process.env.KS_FILE ? 'release keystore' : 'none (debug build)'}`);
