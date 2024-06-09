import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const backButtonImage = require('../assets/back.png'); // Replace with the actual image path

const CropGrown = () => {
  const navigation = useNavigation();

  const handleBackButton = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center', fontSize: 20 }}>Crop Grown in Different Parts Of India</Text>
      <TouchableOpacity onPress={handleBackButton} style={styles.backButton}>
        <Image source={backButtonImage} style={styles.backButtonImage} />
      </TouchableOpacity>
      <View style={styles.webViewContainer}>
        <WebView
          source={{ uri: 'https://republicofcoder.github.io/map_kheti.github.io/' }}
          style={styles.webView}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  backButtonImage: {
    width: 50, // Adjust the width and height as needed
    height: 30,
  },
});

export default CropGrown;
