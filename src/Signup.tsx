import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
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
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isDarkTheme && styles.title_dark]}>
            Sign in
          </Text>
        </View>

        <PasswordForm
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          focus
        />

        <View style={styles.biometryContainer}>
          <Text
            style={[
              styles.biometryLabel,
              isDarkTheme && styles.biometryLabel_dark,
            ]}>
            Unlock with Face ID?
          </Text>

          <Switch
            value={isBiometry}
            onValueChange={biometrySwitchToggle}
            trackColor={{true: '#2187FF', false: '#666'}}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onSubmit}
          style={[
            styles.signupButton,
            isDarkTheme ? styles.signupButton_dark : styles.signupButton_light,
          ]}>
          <Text
            style={[
              styles.signupButtonLabel,
              isDarkTheme
                ? styles.signupButtonLabelColor_dark
                : styles.signupButtonLabelColor_light,
            ]}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DEVICE_WIDTH = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: DEVICE_WIDTH,
  },
  contentContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 18,
  },
  buttonContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 18,
  },
  titleContainer: {
    paddingBottom: 20,
  },
  biometryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    width: '100%',
  },
  signupButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH * 0.78,
    height: 42,
    borderRadius: 21,
  },
  signupButton_light: {
    backgroundColor: '#fff',
    shadowColor: '#2187FF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.24,
    shadowRadius: 3.6,

    elevation: 5,
  },
  signupButton_dark: {
    backgroundColor: '#2187FF',
  },
  signupButtonLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  signupButtonLabelColor_light: {
    color: '#2187FF',
  },
  signupButtonLabelColor_dark: {
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title_dark: {
    color: '#fff',
  },
  biometryLabel: {
    fontSize: 15,
  },
  biometryLabel_dark: {
    color: '#fff',
  },
});
