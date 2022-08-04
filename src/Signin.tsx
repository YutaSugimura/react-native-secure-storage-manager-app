import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {useReset} from './hooks/useReset';
import {useSignin} from './hooks/useSignin';
import {PasswordForm} from './components/passwordForm';

export const SigninScreen: React.FC = () => {
  const isDarkTheme = useColorScheme() === 'dark';
  const {value, onChangeText, onSubmit, signinWithBiometry, enabledBiometry} =
    useSignin();
  const {onReset} = useReset();

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isDarkTheme && styles.title_dark]}>
            Sign in
          </Text>
        </View>

        <PasswordForm value={value} onChangeText={onChangeText} />

        {enabledBiometry && (
          <TouchableOpacity
            onPress={signinWithBiometry}
            style={styles.biometryContainer}>
            <Image
              source={
                isDarkTheme
                  ? require('./assets/images/Face_ID_dark_theme.png')
                  : require('./assets/images/Face_ID_light_theme.png')
              }
              style={styles.biometryImage}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onSubmit}
          style={[
            styles.signinButton,
            isDarkTheme ? styles.signinButton_dark : styles.signinButton_light,
          ]}>
          <Text
            style={[
              styles.signinButtonLabel,
              isDarkTheme
                ? styles.signinButtonLabelColor_dark
                : styles.signinButtonLabelColor_light,
            ]}>
            Sign in
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onReset} style={styles.resetButton}>
          <Text style={styles.resetButtonLabel}>Reset</Text>
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
    marginTop: 20,
  },
  biometryImage: {
    height: 64,
    width: 64,
  },
  signinButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH * 0.78,
    height: 42,
    borderRadius: 21,
  },
  signinButton_light: {
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
  signinButton_dark: {
    backgroundColor: '#2187FF',
  },
  signinButtonLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  signinButtonLabelColor_light: {
    color: '#2187FF',
  },
  signinButtonLabelColor_dark: {
    color: '#fff',
  },
  resetButton: {
    marginTop: 20,
  },
  resetButtonLabel: {
    color: '#2187FF',
    fontSize: 15,
    fontWeight: '700',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  title_dark: {
    color: '#fff',
  },
});
