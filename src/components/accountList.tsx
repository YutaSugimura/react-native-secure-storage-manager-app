import React, {useCallback} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {MainStackNavigationProps} from '../navigations/main';
import {useWalletState} from '../context/wallet';
import {type Account} from '../hooks/useWallet';
import {useCreateWallet} from '../hooks/useCreateWallet';
import {useExportPrivateKey} from '../hooks/useExportPrivatekey';
import {hapticFeedback} from '../handlers/hapticFeedback';

export const AccountList: React.FC = () => {
  const isDarkTheme = useColorScheme() === 'dark';
  const {accountList} = useWalletState();

  const keyExtractor = useCallback(
    (item: Account, index: number) => `${item.address}_${index}`,
    [],
  );

  const renderItem = useCallback(
    ({item, index}: {item: Account; index: number}) => (
      <AccountListItem item={item} index={index} />
    ),
    [],
  );

  if (!accountList) {
    return <Text style={[isDarkTheme && styles.text_dark]}>Loading...</Text>;
  }

  return (
    <FlatList
      data={accountList}
      extraData={accountList}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
    />
  );
};

type AccountListItemProps = {
  item: Account;
  index: number;
};

const AccountListItem: React.FC<AccountListItemProps> = ({
  item: {address, path},
  index,
}) => {
  const isDarkTheme = useColorScheme() === 'dark';
  const {revealPrivatekey} = useExportPrivateKey();

  const onPress = useCallback(async () => {
    await revealPrivatekey(path);
  }, [revealPrivatekey, path]);

  return (
    <View
      style={[
        styles.itemContainer,
        styles.borderBottom,
        index === 0 && styles.borderTop,
      ]}>
      <Text
        numberOfLines={1}
        ellipsizeMode="middle"
        style={[isDarkTheme && styles.text_dark]}>{`address: ${address}`}</Text>
      <Text style={[isDarkTheme && styles.text_dark]}>{`path: ${path}`}</Text>

      <View style={styles.buttonContainerOfListItem}>
        <TouchableOpacity onPress={onPress} style={styles.buttonOfListItem}>
          <Text style={[styles.buttonLabelOfListItem]}>export privatekey</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ListHeader: React.FC = () => {
  const isDarkTheme = useColorScheme() === 'dark';
  const {navigate} = useNavigation<MainStackNavigationProps<'Wallet'>>();
  const {createAccount} = useCreateWallet();

  const onNavigate = () => {
    hapticFeedback('impactMedium');
    navigate('ChangePassword');
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.headerTitle, isDarkTheme && styles.text_dark]}>
        Account List
      </Text>

      <View style={styles.headerButtonContainer}>
        <TouchableOpacity
          onPress={onNavigate}
          style={[styles.headerButton, {marginBottom: 10}]}>
          <Text style={styles.headerButtonLabel}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={createAccount} style={styles.headerButton}>
          <Text style={styles.headerButtonLabel}>Add Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DEVICE_WIDTH = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
  },
  borderTop: {
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  borderBottom: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  buttonContainerOfListItem: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    height: 36,
    width: '100%',
  },
  buttonOfListItem: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 6,
    paddingBottom: 2,
  },
  buttonLabelOfListItem: {
    color: '#2187FF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerContainer: {
    width: DEVICE_WIDTH,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButtonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 30,
    borderColor: '#2187FF',
    borderWidth: 1,
    borderRadius: 12,
  },
  headerButtonLabel: {
    color: '#2187FF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  text_dark: {
    color: '#fff',
  },
});
