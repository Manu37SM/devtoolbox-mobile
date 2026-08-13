import React, { useCallback, useRef, useState } from 'react';
import {
  BackHandler,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewNavigation } from 'react-native-webview';

// react-native-webview's bundled TS defs don't yet resolve cleanly against
// React 19's component typings (known upstream issue) — this doesn't affect
// runtime behavior, only `tsc` prop-checking, so cast the component type
// rather than pull in a patch just for type-checking.
const AnyWebView = WebView as unknown as React.ComponentType<any>;
import NetInfo from '@react-native-community/netinfo';
import { APP_URL } from '@/config/env';
import { colors } from '@/theme/colors';
import SplashScreen from '@/screens/SplashScreen';
import OfflineScreen from '@/screens/OfflineScreen';
import ErrorBoundary from '@/components/ErrorBoundary';

/**
 * DevToolbox mobile is a thin native shell around the live web app
 * (see src/config/env.ts). This keeps mobile at 100% feature parity with
 * devtoolbox-frontend automatically — every tool that ships on the website
 * is available here the moment it's deployed, with no separate native
 * screen to build/maintain per tool.
 *
 * Native-only additions on top of the web experience:
 *  - Android hardware back button navigates the web history instead of
 *    exiting the app.
 *  - Native pull-to-refresh (react-native-webview's pullToRefreshEnabled).
 *  - An offline / load-failure screen with Retry, since a bare WebView
 *    would otherwise show a blank white screen with no connection.
 */
export default function App() {
  const webviewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'offline' | 'error'>(
    'loading',
  );
  const [key, setKey] = useState(0);

  const handleRetry = useCallback(() => {
    setStatus('loading');
    setKey((k) => k + 1);
  }, []);

  const handleNavStateChange = useCallback((navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
  }, []);

  React.useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack]);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected && status !== 'loading') {
        setStatus('offline');
      }
    });
    return () => unsubscribe();
  }, [status]);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
          <StatusBar barStyle="light-content" backgroundColor={colors.background} />
          <View style={styles.flex}>
            {status !== 'ready' && status !== 'loading' ? (
              <OfflineScreen onRetry={handleRetry} httpError={status === 'error'} />
            ) : (
              <>
                <AnyWebView
                  key={key}
                  ref={webviewRef}
                  source={{ uri: APP_URL }}
                  style={styles.flex}
                  onNavigationStateChange={handleNavStateChange}
                  onLoadEnd={() => setStatus('ready')}
                  onError={async () => {
                    const net = await NetInfo.fetch();
                    setStatus(net.isConnected ? 'error' : 'offline');
                  }}
                  onHttpError={() => setStatus('error')}
                  pullToRefreshEnabled
                  startInLoadingState={false}
                  allowsBackForwardNavigationGestures
                  domStorageEnabled
                  javaScriptEnabled
                  sharedCookiesEnabled
                  setSupportMultipleWindows={false}
                  originWhitelist={['https://*', 'http://10.0.2.2:*']}
                />
                {status === 'loading' && (
                  <View style={StyleSheet.absoluteFill}>
                    <SplashScreen />
                  </View>
                )}
              </>
            )}
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
});
