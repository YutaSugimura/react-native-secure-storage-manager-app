import React from 'react';
import {Button, Dimensions, StyleSheet, View} from 'react-native';
import {useWalletState, WalletProvider} from './context/wallet';
import {useCreateWallet} from './hooks/useCreateWallet';
import {AccountList} from './components/accountList';

export const WalletScreen: React.FC = () => {
  return (
    <WalletProvider>
      <View style={styles.container}>
        <Main />
      </View>
    </WalletProvider>
  );
};

const Main: React.FC = () => {
  const {isWallet} = useWalletState();
  const {createWallet} = useCreateWallet();

  if (!isWallet) {
    return (
      <Button
        title="create Wallet"
        disabled={isWallet}
        onPress={createWallet}
      />
    );
  }

  return <AccountList />;
};

const DEVICE_WIDTH = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: DEVICE_WIDTH,
  },
});
