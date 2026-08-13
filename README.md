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

If your SDK/JDK paths differ, edit those two files before building.

## Build

```bash
npm install
cd android
.\gradlew.bat assembleRelease   # Windows
# or: ./gradlew assembleRelease  # macOS/Linux
```

APK output: `android/app/build/outputs/apk/release/app-release.apk`

No Play Store account or paid signing needed — this release build is signed with the Android debug keystore (fine for sideloading/demo use, same as `assembleDebug`). Install the APK directly on a device with "install from unknown sources" enabled, or share the file.

To run on a plugged-in/emulated device instead:

```bash
npm run android
```

## iOS

Not built, same reasoning as RailLens: no $99/year Apple Developer account means no shareable build, only a 7-day device-registered one. Nothing about the code is Android-specific — an `ios/` folder could be added later with `npx react-native init` if that decision changes.
