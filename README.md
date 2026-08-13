# DevToolbox Mobile

Android app for [DevToolbox](https://devtoolbox-frontend-final.vercel.app) — a thin native shell around the live website (bare React Native CLI, same approach as RailLens's `train-db-mobile`).

## Why a WebView shell, not a native port

DevToolbox is 67+ tools that already run entirely client-side in the browser (see the main repo's `CLAUDE.md`, rule #1). Wrapping the live site in a native shell gives the app automatic, always-current feature parity with the website — every tool that ships on devtoolbox-frontend is available here immediately, with nothing to port or keep in sync tool-by-tool. Native additions on top of the web experience:

- Android hardware back button navigates web history instead of exiting the app
- Native pull-to-refresh
- Offline / load-failure screen with Retry (a bare WebView would otherwise show a blank white screen)
- Branded splash screen and status bar matching the "versatility" theme

Points at `https://devtoolbox-frontend-final.vercel.app` — see `src/config/env.ts` to switch to a local dev server.

## One-time setup (already done in this checkout)

- `android/local.properties` → `sdk.dir` set to the local Android SDK path
- `android/gradle.properties` → `org.gradle.java.home` set to the local JDK 17 path
- `android/keystore.properties` + `android/app/release.keystore` → a dedicated release signing key (see below)

If your SDK/JDK paths differ, edit `local.properties`/`gradle.properties` before building.

## Release signing (VirusTotal false-positive fix)

Same fix applied to RailLens's `train-db-mobile` earlier today: `assembleRelease` used to fall back to signing with the Android SDK's shared `debug.keystore` (password `android`, identical on every RN install worldwide). That's unsafe for a real app, and separately AV heuristics — AhnLab-V3 on VirusTotal flagged it — treat that shared certificate as a red flag since it carries zero publisher reputation and is reused by whatever else was also built/signed with defaults.

The fix: `android/app/build.gradle` now signs release builds with a real key loaded from `android/keystore.properties` (git-ignored, never committed — see `.gitignore`'s `*.keystore`/`keystore.properties` rules), and only falls back to the debug keystore when that file is absent, so a clean checkout without it still builds (`assembleDebug` always works; `assembleRelease` without `keystore.properties` also still works, but you shouldn't ship that build).

This checkout already has `android/keystore.properties` and `android/app/release.keystore` in place with a dedicated key generated for DevToolbox (not reused from RailLens — each app should have its own signing identity). If you ever need to regenerate it:

```bash
cd android
keytool -genkeypair -v -storetype PKCS12 -keystore app/release.keystore \
  -alias devtoolbox-release -keyalg RSA -keysize 2048 -validity 10000
```

then update `keystore.properties` with the new `storeFile`/`storePassword`/`keyAlias`/`keyPassword`. Keep both files out of git and back them up somewhere safe — losing the keystore means future releases can no longer update an app installed from an earlier build signed with it.

## Build

```bash
npm install
cd android
.\gradlew.bat assembleRelease   # Windows
# or: ./gradlew assembleRelease  # macOS/Linux
```

APK output: `android/app/build/outputs/apk/release/app-release.apk`, signed with the dedicated release key above. No Play Store account needed — install the APK directly on a device with "install from unknown sources" enabled, or share the file.

To run on a plugged-in/emulated device instead:

```bash
npm run android
```

## iOS

Not built, same reasoning as RailLens: no $99/year Apple Developer account means no shareable build, only a 7-day device-registered one. Nothing about the code is Android-specific — an `ios/` folder could be added later with `npx react-native init` if that decision changes.
