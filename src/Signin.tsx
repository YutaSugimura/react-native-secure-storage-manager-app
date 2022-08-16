import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Controller} from 'react-hook-form';
import {useReset} from './hooks/useReset';
import {useSignin} from './hooks/useSignin';
import {RoundedButton} from './components/roundedButton';
import {PasswordForm} from './components/passwordForm';
import {ErrorText} from './components/ErrorText';

export const SigninScreen: React.FC = () => {
  const isDarkTheme = useColorScheme() === 'dark';
  const {control, onSubmit, signinWithBiometry, enabledBiometry} = useSignin();
  const {onReset} = useReset();

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
            render={({
              field: {onChange, onBlur, value},
              formState: {errors},
            }) => (
              <>
                <PasswordForm
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={onSubmit}
                  focus
                />
                {errors?.password?.message && (
                  <ErrorText errorMessage={errors.password.message} />
                )}
              </>
            )}
          />

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
          <RoundedButton onPress={onSubmit} title="Sign in" />

          <TouchableOpacity onPress={onReset} style={styles.resetButton}>
            <Text style={styles.resetButtonLabel}>Reset</Text>
          </TouchableOpacity>
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
    marginTop: 20,
  },
  biometryImage: {
    height: 64,
    width: 64,
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
