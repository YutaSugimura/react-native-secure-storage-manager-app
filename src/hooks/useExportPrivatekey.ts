import {useCallback} from 'react';
import {ethers} from 'ethers';
import {getGenericPassword, getSecretValue} from '../storage/keychain';
import Encryptor from '../handlers/encryptor';
import {logger} from '../handlers/logger';

const encryptor = new Encryptor();

export const useExportPrivateKey = () => {
  const exportPrivateKey = useCallback(async (path: string) => {
    logger('** START EXPORT PRIVATE_KEY **');

    const credentials = await getGenericPassword();

    if (!credentials) {
      logger('credentials does not exists');
      return false;
    }

    const encryptionKey = credentials.password;
    logger(`encryptionKey: ${encryptionKey}`);

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

    if (!mnemonic) {
      logger('decrypt failed');
      return false;
    }

    logger(`decrypt mnemonic: ${mnemonic}`);

    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);

    logger('** END EXPORT PRIVATE_KEY **');
    return wallet.privateKey;
  }, []);

  return {
    exportPrivateKey,
  };
};
