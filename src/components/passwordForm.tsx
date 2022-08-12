import React, {useCallback, useEffect, useRef} from 'react';
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  useColorScheme,
  InputAccessoryView,
  TouchableOpacity,
  Text,
  Dimensions,
  View,
  Platform,
} from 'react-native';

const inputAccessoryViewID = 'simple';

type Props = TextInputProps & {
  focus?: boolean;
};

export const PasswordForm: React.FC<Props> = ({
  value,
  onChangeText,
  onBlur,
  onSubmitEditing,
  focus,
}) => {
  const isDarkTheme = useColorScheme() === 'dark';
  const ref = useRef<TextInput>(null);

  useEffect(() => {
    if (focus) {
      ref.current?.focus();
    }
  }, [focus]);

  const onCloseKeyboard = useCallback(() => {
    ref.current?.blur();
  }, []);

  return (
    <>
      <TextInput
        inputAccessoryViewID={inputAccessoryViewID}
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
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
        returnKeyType="done"
        secureTextEntry={true}
        onSubmitEditing={onSubmitEditing}
      />

      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <View
            style={[
              styles.accessoryContainer,
              isDarkTheme && styles.accessoryContainer_dark,
            ]}>
            <TouchableOpacity
              onPress={onCloseKeyboard}
              style={styles.accessoryButton}>
              <Text
                style={[
                  styles.accessoryButtonLabel,
                  isDarkTheme && styles.accessoryButtonLabel_dark,
                ]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}
    </>
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
  accessoryContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 40,
    width: Dimensions.get('screen').width,
    backgroundColor: '#eee',
    borderTopWidth: 1,
    borderBottomWidth: 0.1,
    borderColor: '#ccc',
    shadowColor: '#666',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.21,
    shadowRadius: 3.6,
    elevation: 5,
  },
  accessoryContainer_dark: {
    backgroundColor: '#353535',
    borderColor: '#aaa',
    shadowColor: '#bbb',
  },
  accessoryButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 4,
    paddingBottom: 4,
  },
  accessoryButtonLabel: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  accessoryButtonLabel_dark: {
    color: '#eee',
  },
});
