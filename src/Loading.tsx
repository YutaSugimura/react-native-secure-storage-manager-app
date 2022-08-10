import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export const LoadingScreen: React.FC = () => {
  const isDarkTheme = useColorScheme() === 'dark';

  return (
    <SafeAreaView
      style={[
        styles.safeContainer,
        isDarkTheme ? Colors.darker : Colors.lighter,
      ]}>
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
