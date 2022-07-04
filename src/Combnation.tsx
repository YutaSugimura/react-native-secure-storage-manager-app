import React, {useMemo} from 'react';
import {
  Button,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {useSecretKey} from './handlers/combnation';
import {useBiometry} from './hooks/useBiometry';

export const Combination: React.FC = () => {
  const {isBiometry, toggle} = useBiometry();

  const {saveSecretKey, revealSecretKey, getAllStoredKeys, clearAllKeys} =
    useSecretKey(isBiometry);

  const onSave = async () => {
    const result = await saveSecretKey('realm_1', 'privateKey');
    console.log(result);
  };

  const onRevealSavedValue = async () => {
    const result = await revealSecretKey('realm_1');
    console.log(result);
  };

  const onRevealAllKeys = async () => {
    const result = await getAllStoredKeys();
    console.log(result);
  };

  const onClearAllKeys = async () => {
    const result = await clearAllKeys();
    console.log(result);
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
      <Text style={textStyle}>Managed using keychain and mmkv</Text>

      <View style={styles.switchContainer}>
        <Switch value={isBiometry} onValueChange={toggle} />
      </View>

      <Button title="SaveSecretKey" onPress={onSave} />
      <Button title="RevealScretKey" onPress={onRevealSavedValue} />
      <Button title="RevealAllKeys" onPress={onRevealAllKeys} />
      <Button title="ClearAllKeys" onPress={onClearAllKeys} />
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
