import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useWalletState} from './context/wallet';
import {ModalProvider} from './context/modal';
import {useCreateWallet} from './hooks/useCreateWallet';
import {AccountList} from './components/accountList';
import {PasswordModal} from './components/modal';

export const WalletScreen: React.FC = () => {
  const isDarkTheme = useColorScheme() === 'dark';

  return (
    <SafeAreaView
      style={[
        styles.safeContainer,
        isDarkTheme ? Colors.darker : Colors.lighter,
      ]}>
      <View style={styles.container}>
        <ModalProvider
          modalComponent={<PasswordModal title="Confirm Password" />}>
          <Main />
        </ModalProvider>
      </View>
    </SafeAreaView>
  );
};

const Main: React.FC = () => {
  const {isWallet} = useWalletState();
  const {createWallet} = useCreateWallet();

  if (!isWallet) {
    return (
      <View style={styles.box}>
        <TouchableOpacity disabled={isWallet} onPress={createWallet}>
          <Text style={styles.buttonLabel}>Create Wallet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <AccountList />;
};

const DEVICE_WIDTH = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: DEVICE_WIDTH,
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#2187FF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
