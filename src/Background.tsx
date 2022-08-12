import React from 'react';
import {Image, SafeAreaView, StyleSheet} from 'react-native';

export const BackgroundScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('./assets/icons/icon.png')} style={styles.image} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 128,
    height: 128,
  },
});
