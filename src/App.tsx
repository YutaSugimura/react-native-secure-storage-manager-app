/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {AuthProvider, useAuthState} from './context/login';
import {SigninScreen} from './Signin';
import {SignupScreen} from './Signup';
import {WalletScreen} from './Wallet';

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AuthProvider>
      <SafeAreaView
        style={[styles.container, isDarkMode ? Colors.darker : Colors.lighter]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        <Main />
      </SafeAreaView>
    </AuthProvider>
  );
};

const Main: React.FC = () => {
  const state = useAuthState();

  if (state.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!state.isAccount) {
    return <SignupScreen />;
  }

  if (state.isAccount && !state.isLogin) {
    return <SigninScreen />;
  }

  return (
    <View style={styles.box}>
      <WalletScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  box: {
    flex: 1,
  },
});

export default App;
