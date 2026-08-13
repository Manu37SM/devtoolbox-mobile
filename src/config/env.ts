/**
 * DevToolbox mobile app configuration.
 *
 * This app is a native shell around the live DevToolbox web app. Nearly every
 * DevToolbox tool already runs 100% client-side in the browser (see the web
 * repo's CLAUDE.md, rule #1), so wrapping the live site gives the mobile app
 * automatic, always-up-to-date feature parity with the website instead of a
 * separate native port that would drift out of sync tool-by-tool.
 */

export const LIVE_URL = 'https://devtoolbox-frontend-final.vercel.app';

// Flip this to a LAN URL (e.g. http://192.168.1.20:3000) while developing
// against `npm run dev` in the web repo, same idea as RailLens's
// USE_LOCAL_BACKEND/LIVE_BASE_URL split in train-db-mobile/src/config/env.ts.
export const USE_LOCAL_DEV_SERVER = false;
export const LOCAL_DEV_URL = 'http://10.0.2.2:3000';

export const APP_URL = USE_LOCAL_DEV_SERVER ? LOCAL_DEV_URL : LIVE_URL;
