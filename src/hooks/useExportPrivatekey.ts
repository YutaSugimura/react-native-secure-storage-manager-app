import {useCallback} from 'react';
import {Alert} from 'react-native';
import {ethers} from 'ethers';
import {useModalDispatch, useModalState} from '../context/modal';
import {getGenericPassword, getSecretValue} from '../storage/keychain';
import {storage} from '../storage/storage';
import Encryptor from '../handlers/encryptor';
import {sha256} from '../handlers/hash';
import {hapticFeedback} from '../handlers/hapticFeedback';
import {logger} from '../handlers/logger';

const encryptor = new Encryptor();

export const useExportPrivateKey = () => {
  const {modalVisible} = useModalState();
  const {openModal, closeModal} = useModalDispatch();

  const revealPrivatekey = useCallback(
    async (path: string, password?: string) => {
      logger('** START EXPORT PRIVATE_KEY **');
      hapticFeedback('impactLight');

      if (modalVisible) {
        logger('Close Password Modal');
        closeModal();
      }

      const credentials = await getGenericPassword();

      if (!credentials) {
        logger('credentials does not exists');
        return false;
      }

      const enabledBiometry = storage.getBoolean('biometrics');
      logger(`biometry: ${enabledBiometry}`);

      const encryptionKey = credentials.password;

      if (!enabledBiometry && !password) {
        logger('ERROR password does not exists');
        openModal(path);
        logger('Open Password Modal');

        return false;
      } else if (!enabledBiometry && password) {
        const hashedPassword = sha256(password);
        if (hashedPassword !== encryptionKey) {
          logger('Password is different');
          openModal(path);
          return false;
        }

        logger(`password: ${password}, hash: ${hashedPassword}`);
      }

      const encryptedMnemonicDataStrObj = await getSecretValue('mnemonic');

      if (!encryptedMnemonicDataStrObj) {
        logger('mnemonic does not exsits');
        return false;
      }

      const {salt, iv, cipher} = JSON.parse(
        encryptedMnemonicDataStrObj.password,
      ) as {
        salt: string;
        iv: string;
        cipher: string;
      };
      logger(`keychain mnemonic data: ${encryptedMnemonicDataStrObj.password}`);

      const mnemonic = encryptor.decrypt(encryptionKey, {salt, iv, cipher});

      if (!mnemonic || !ethers.utils.isValidMnemonic(mnemonic)) {
        logger('decrypt failed');
        return false;
      }

      logger(`decrypt mnemonic: ${mnemonic}`);

      const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
      logger(`EXPORT PRIVATE KEY: ${wallet.privateKey}`);

      Alert.alert(
        'Alert',
        `privatekey should never be shared with others! \n private key: \n${wallet.privateKey}`,
      );

      logger('** END EXPORT PRIVATE_KEY **');
      return wallet.privateKey;
    },
    [closeModal, modalVisible, openModal],
  );

  return {
    revealPrivatekey,
  };
};
