import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Controller} from 'react-hook-form';
import {useChangePassword} from './hooks/useChangePassword';
import {PasswordForm} from './components/passwordForm';
import {RoundedButton} from './components/roundedButton';
import {ErrorText} from './components/ErrorText';

export const ChangePassowrdScreen: React.FC = () => {
  const isDarkTheme = useColorScheme() === 'dark';

  const {control, onSubmit, watch} = useChangePassword();

  return (
    <SafeAreaView
      style={[
        styles.safeContainer,
        isDarkTheme ? Colors.darker : Colors.lighter,
      ]}>
      <StatusBar barStyle={'light-content'} />

      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isDarkTheme && styles.title_dark]}>
            Change Password
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formLabelContainer}>
            <Text
              style={[
                styles.formLabel,
                isDarkTheme ? styles.formLabel_dark : styles.formLabel_light,
              ]}>
              Password
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
                />
                {errors?.password?.message && (
                  <ErrorText errorMessage={errors.password.message} />
                )}
              </>
            )}
          />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formLabelContainer}>
            <Text
              style={[
                styles.formLabel,
                isDarkTheme ? styles.formLabel_dark : styles.formLabel_light,
              ]}>
              New Password
            </Text>
          </View>

          <Controller
            name="newPassword"
            control={control}
            rules={{
              required: true,
              validate: value =>
                value !== watch('password') || 'Same as previous password',
            }}
            render={({field: {onChange, onBlur, value}, formState: {}}) => (
              <PasswordForm
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                onSubmitEditing={onSubmit}
              />
            )}
          />
        </View>

        <View style={[styles.formContainer, styles.biometriesContainer]}>
          <View>
            <Text
              style={[
                styles.formLabel,
                isDarkTheme ? styles.formLabel_dark : styles.formLabel_light,
              ]}>
              Face with ID
            </Text>
          </View>

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

        <View style={styles.buttonContainer}>
          <RoundedButton title="Change Password" onPress={onSubmit} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
  },
  titleContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#111',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title_dark: {
    color: '#fff',
  },
  formContainer: {
    paddingTop: 12,
  },
  formLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formLabelContainer: {
    paddingBottom: 10,
  },
  formLabel_light: {
    color: '#111',
  },
  formLabel_dark: {
    color: '#fff',
  },
  biometriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 30,
  },
  buttonContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
