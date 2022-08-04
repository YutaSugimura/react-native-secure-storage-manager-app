import React from 'react';
import {StyleSheet, TextInput, useColorScheme} from 'react-native';

type Props = {
  value?: string;
  onChangeText: (newText: string) => void;
};

export const PasswordForm: React.FC<Props> = ({value, onChangeText}) => {
  const isDarkTheme = useColorScheme() === 'dark';

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="password"
      placeholderTextColor={isDarkTheme ? '#aaa' : '#ddd'}
      style={[
        styles.inputText,
        isDarkTheme ? styles.inputText_dark : styles.inputText_light,
        isDarkTheme ? styles.borderColor_dark : styles.borderColor_light,
      ]}
      autoCorrect={false}
      autoCapitalize="none"
      autoComplete="password"
      secureTextEntry={true}
    />
  );
};

const styles = StyleSheet.create({
  inputText: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    paddingLeft: 12,
    paddingRight: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  borderColor_light: {
    borderColor: '#ccc',
  },
  borderColor_dark: {
    borderColor: '#999',
  },
  inputText_light: {
    backgroundColor: '#fff',
    color: '#111',
  },
  inputText_dark: {
    backgroundColor: '#353535',
    color: '#fff',
  },
});
