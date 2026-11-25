import React, { useEffect } from 'react';
import { StyleSheet, View, Platform, StatusBar as RNStatusBar, AppState } from 'react-native';
import { StatusBar, setStatusBarHidden, setStatusBarTranslucent } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { WebView } from 'react-native-webview';
import { GAME_HTML } from './gameHtml';

const statusBarHeight = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 36) : 0;
const htmlWithInsets = Platform.OS === 'android'
  ? GAME_HTML.replace('</head>', `<style>:root{--sat:${statusBarHeight}px;}</style></head>`)
  : GAME_HTML;

async function hideSystemBars() {
  if (Platform.OS === 'web') return;
  try {
    if (Platform.OS === 'android') {
      RNStatusBar.setTranslucent(true);
      RNStatusBar.setBackgroundColor('transparent', false);
      setStatusBarTranslucent(true);
    }
    RNStatusBar.setHidden(true, 'none');
    setStatusBarHidden(true, 'none');
  } catch (e) {}
  if (Platform.OS === 'android') {
    try { await NavigationBar.setPositionAsync('absolute'); } catch (e) {}
    try { await NavigationBar.setBackgroundColorAsync('#00000000'); } catch (e) {}
    try { await NavigationBar.setBehaviorAsync('overlay-swipe'); } catch (e) {}
    try { await NavigationBar.setVisibilityAsync('hidden'); } catch (e) {}
  }
}

export default function App() {
  useEffect(() => {
    let rehideTimer = null;
    hideSystemBars();

    const appSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') hideSystemBars();
    });

    let navSub = null;
    if (Platform.OS === 'android') {
      try {
        navSub = NavigationBar.addVisibilityListener(({ visibility }) => {
          if (visibility === 'visible') {
            if (rehideTimer) clearTimeout(rehideTimer);
            rehideTimer = setTimeout(() => hideSystemBars(), 2200);
          }
        });
      } catch (e) {}
    }

    return () => {
      if (rehideTimer) clearTimeout(rehideTimer);
      appSub && appSub.remove();
      navSub && navSub.remove();
    };
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          srcDoc={GAME_HTML}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Water Sort Game"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} style="light" translucent={true} backgroundColor="transparent" />
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlWithInsets }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        bounces={false}
        scrollEnabled={false}
        overScrollMode="never"
        androidHardwareAccelerationDisabled={false}
        androidLayerType="hardware"
        renderToHardwareTextureAndroid={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08051a',
  },
  webview: {
    flex: 1,
    backgroundColor: '#08051a',
  },
});

