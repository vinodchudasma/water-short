import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import { GAME_HTML } from './gameHtml';

export default function App() {
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
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />
      <WebView
        originWhitelist={['*']}
        source={{ html: GAME_HTML }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        bounces={false}
        scrollEnabled={false}
        overScrollMode="never"
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

