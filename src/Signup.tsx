import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Controller} from 'react-hook-form';
import {useSignup} from './hooks/useSignup';
import {RoundedButton} from './components/roundedButton';
import {PasswordForm} from './components/passwordForm';

export const SignupScreen: React.FC = () => {
  const isDarkTheme = useColorScheme() === 'dark';
  const {control, onSubmit} = useSignup();

  return (
    <SafeAreaView
      style={[
        styles.safeContainer,
        isDarkTheme ? Colors.darker : Colors.lighter,
      ]}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, isDarkTheme && styles.title_dark]}>
              Sign in
            </Text>
          </View>

          <Controller
            name="password"
            control={control}
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}, formState: {}}) => (
              <>
                <PasswordForm
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={onSubmit}
                  focus
                />
              </>
            )}
          />

          <View style={styles.biometryContainer}>
            <Text
              style={[
                styles.biometryLabel,
                isDarkTheme && styles.biometryLabel_dark,
              ]}>
              Unlock with Face ID?
            </Text>

            <Controller
              control={control}
              name="biometrics"
              render={({field: {value, onChange}}) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{true: '#2187FF', false: '#666'}}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <RoundedButton onPress={onSubmit} title="Sign up" />
        </View>
      </View>
    </SafeAreaView>
  );
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
