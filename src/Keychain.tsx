import React, {useMemo} from 'react';
import {
  Button,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {useBiometry} from './hooks/useBiometry';
import {useSecretKey} from './handlers/keychain';

const key = 'app_secret_key';

export const Keychain: React.FC = () => {
  const {isBiometry, toggle} = useBiometry();
  const {saveSecretKey, revealSecretKey, clearSecretKey, clearMasterKey} =
    useSecretKey(isBiometry);

  const onSaveSecretKey = async () => {
    console.log(await saveSecretKey(key, 'this is a secret key'));
  };

  const onRevealSecretKey = async () => {
    console.log(await revealSecretKey(key));
  };

  const onClearSecretKey = async () => {
    console.log(await clearSecretKey(key));
  };

  const isDarkMode = useColorScheme() === 'dark';

  const textStyle = useMemo(
    () => ({
      color: isDarkMode ? '#fff' : '#111',
      fontSize: 18,
    }),
    [isDarkMode],
  );

  return (
    <View>
      <Text style={textStyle}>Managed by keychain only</Text>

      <View style={styles.switchContainer}>
        <Switch value={isBiometry} onValueChange={toggle} />
      </View>

      <Button title="SaveSecretKey" onPress={onSaveSecretKey} />
      <Button title="RevealScretKey" onPress={onRevealSecretKey} />
      <Button title="ClearSecretKey" onPress={onClearSecretKey} />
      <Button title="clearMasterKey" onPress={clearMasterKey} />
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
});
