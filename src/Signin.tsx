import React from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {useReset} from './hooks/useReset';
import {useSignin} from './hooks/useSignin';
import {PasswordForm} from './components/passwordForm';

export const SigninScreen: React.FC = () => {
  const isDarkTheme = useColorScheme() === 'dark';
  const {value, onChangeText, onSubmit, signinWithBiometry} = useSignin();
  const {onReset} = useReset();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isDarkTheme && styles.title_dark]}>
        Signin
      </Text>

      <PasswordForm value={value} onChangeText={onChangeText} />
      <Button title="Signin" onPress={onSubmit} />
      <Button title="Auto" onPress={signinWithBiometry} />

      <Button title="All Reset" onPress={onReset} />
    </View>
  );
};

const DEVICE_WIDTH = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  container: {
    width: DEVICE_WIDTH,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title_dark: {
    color: '#fff',
  },
});
