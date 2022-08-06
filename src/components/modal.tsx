import React, {useState} from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {useModalDispatch, useModalState} from '../context/modal';
import {useExportPrivateKey} from '../hooks/useExportPrivatekey';
import {PasswordForm} from './passwordForm';

type Props = {
  title: string;
};

export const PasswordModal: React.FC<Props> = ({title}) => {
  const isDarkTheme = useColorScheme() === 'dark';
  const modalState = useModalState();
  const {closeModal} = useModalDispatch();
  const {revealPrivatekey} = useExportPrivateKey();

  const [value, setValue] = useState<string>('');

  const onSubmit = async () => {
    if (modalState.modalVisible) {
      const targetItemId = modalState.targetItemId;
      setValue('');
      await revealPrivatekey(targetItemId, value);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={modalState.modalVisible}>
      <View style={styles.container}>
        <View
          style={[
            styles.modalContainer,
            isDarkTheme
              ? styles.modalContainerColor_dark
              : styles.modalContainerColor_light,
          ]}>
          <View style={styles.headerContainer}>
            <Text
              style={[
                styles.headerTitle,
                isDarkTheme ? styles.textColor_dark : styles.textColor_light,
              ]}>
              {title}
            </Text>

            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text
                style={[
                  isDarkTheme ? styles.textColor_dark : styles.textColor_light,
                ]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mainContainer}>
            <Text
              style={[
                styles.label,
                isDarkTheme ? styles.textColor_dark : styles.textColor_light,
              ]}>
              Confirm Password
            </Text>

            <Text
              style={[
                styles.description,
                isDarkTheme ? styles.textColor_dark : styles.textColor_light,
              ]}>
              Need password to reveal privatekey
            </Text>

            <View style={styles.box}>
              <View style={styles.formContainer}>
                <PasswordForm
                  value={value}
                  onChangeText={setValue}
                  focus={modalState.modalVisible}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={onSubmit}>
                <Text style={styles.buttonLabel}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const DEVICE_WIDTH = Dimensions.get('screen').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  modalContainer: {
    height: DEVICE_HEIGHT * 0.36,
    width: DEVICE_WIDTH * 0.78,
    borderRadius: 12,
    shadowColor: '#111',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.24,
    shadowRadius: 3.6,
    elevation: 5,
  },
  modalContainerColor_light: {
    backgroundColor: '#fff',
  },
  modalContainerColor_dark: {
    backgroundColor: '#353535',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: DEVICE_HEIGHT * 0.042,
    paddingLeft: DEVICE_WIDTH * 0.03,
    paddingRight: DEVICE_WIDTH * 0.03,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  mainContainer: {
    paddingLeft: DEVICE_WIDTH * 0.03,
    paddingRight: DEVICE_WIDTH * 0.03,
    paddingTop: DEVICE_HEIGHT * 0.01,
    paddingBottom: DEVICE_HEIGHT * 0.01,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 2,
    paddingBottom: 2,
  },
  box: {
    width: '100%',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    marginTop: 12,
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 15,
    marginTop: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: DEVICE_HEIGHT * 0.048,
    width: DEVICE_WIDTH * 0.6,
    backgroundColor: '#2187FF',
    borderRadius: 20,
    marginTop: 20,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textColor_light: {
    color: '#111',
  },
  textColor_dark: {
    color: '#fff',
  },
});
