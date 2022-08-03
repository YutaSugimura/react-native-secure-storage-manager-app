import {useMemo} from 'react';
import * as Keychain from 'react-native-keychain';
import crypto from 'react-native-quick-crypto';
import {randomBytes} from './randomBytes';
import Encryptor from './encryptor';

const service = 'encryption_key_service';

const encryptor = new Encryptor();

export const useSecretKey = (isBiometry?: boolean) => {
  const keychainOptions = useMemo(() => {
    if (isBiometry) {
      return {
        service,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      };
    }

    return {
      service,
    };
  }, [isBiometry]);

  const saveSecretKey = async (dataKey: string, value: string) => {
    let password: string;
    const credentials = await Keychain.getGenericPassword(keychainOptions);
    if (credentials) {
      password = credentials.password;
    } else {
      const newPassword = randomBytes(64).toString('hex');
      const result = await Keychain.setGenericPassword(
        service,
        newPassword,
        keychainOptions,
      );

      if (!result) {
        return false;
      }

      password = newPassword;
    }

    const encryptionKey = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
    const strObj = encryptor.encrypt(encryptionKey, value);

    if (strObj) {
      return await Keychain.setInternetCredentials(
        dataKey,
        dataKey,
        JSON.stringify(strObj),
        {
          service,
        },
      );
    }

    return false;
  };

  const revealSecretKey = async (key: string) => {
    const credentials = await Keychain.getGenericPassword(keychainOptions);
    if (!credentials) {
      return false;
    }

    const password = credentials.password;
    const encryptionKey = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    const hasKey = await Keychain.hasInternetCredentials(key);
    if (!hasKey) {
      console.log('value does not exist');
      return false;
    }

    const encryptedStrObj = await Keychain.getInternetCredentials(key, {
      service,
    });

    if (encryptedStrObj) {
      const rowData = encryptor.decrypt(
        encryptionKey,
        JSON.parse(encryptedStrObj.password),
      );

      return rowData;
    }

    return false;
  };

  const clearSecretKey = async (key: string) => {
    try {
      const hasKey = await Keychain.hasInternetCredentials(key);
      if (!hasKey) {
        console.log('value does not exist');
        return false;
      }

      await Keychain.resetInternetCredentials(key, keychainOptions);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const clearMasterKey = async () => {
    try {
      console.log('clear Master key');
      return await Keychain.resetGenericPassword(keychainOptions);
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  return {
    saveSecretKey,
    revealSecretKey,
    clearSecretKey,
    clearMasterKey,
  };
};
