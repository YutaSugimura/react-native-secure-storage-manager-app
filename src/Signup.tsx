import React from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {useSignup} from './hooks/useSignup';
import {PasswordForm} from './components/passwordForm';

export const SignupScreen: React.FC = () => {
  const isDarkTheme = useColorScheme() === 'dark';
  const {value, onChangeText, isBiometry, biometrySwitchToggle, onSubmit} =
    useSignup();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isDarkTheme && styles.title_dark]}>
        Signin
      </Text>

      <PasswordForm value={value} onChangeText={onChangeText} />
      <Switch value={isBiometry} onValueChange={biometrySwitchToggle} />
      <Button title="Signup" onPress={onSubmit} />
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
