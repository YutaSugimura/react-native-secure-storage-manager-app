import {useMemo} from 'react';
import * as Keychain from 'react-native-keychain';
import {sha256} from 'react-native-sha256';
import {MMKV} from 'react-native-mmkv';
import {randomBytes} from '../randomBytes';

const service = 'encryption_key_service';
const storage_id = 'user-secretkey-storage';

export const useSecretKey = (
  isBiometry?: boolean,
  customStorageId?: string,
) => {
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

  const saveSecretKey = async (key: string, value: string) => {
    let password: string;
    const credentials = await Keychain.getGenericPassword(keychainOptions);
    if (credentials) {
      password = credentials.password;
    } else {
      const newPassword = await randomBytes(64);
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

    const encryptionKey = await sha256(password);
    const storage = new MMKV({
      id: customStorageId ?? storage_id,
      encryptionKey,
    });

    const hasKey = storage.contains(key);
    if (hasKey) {
      return false;
    }

    storage.set(key, value);

    const savedValue = storage.getString(key);
    if (savedValue !== value) {
      return false;
    }

    return true;
  };

  const revealSecretKey = async (key: string) => {
    const credentials = await Keychain.getGenericPassword(keychainOptions);
    if (!credentials) {
      return undefined;
    }

    const password = credentials.password;
    const encryptionKey = await sha256(password);
    const storage = new MMKV({
      id: customStorageId ?? storage_id,
      encryptionKey,
    });

    const hasTargetKey = storage.contains(key);
    if (!hasTargetKey) {
      return undefined;
    }

    return storage.getString(key);
  };

  const getAllStoredKeys = async () => {
    const credentials = await Keychain.getGenericPassword(keychainOptions);
    if (!credentials) {
      return [];
    }

    const password = credentials.password;
    const encryptionKey = await sha256(password);
    const storage = new MMKV({
      id: customStorageId ?? storage_id,
      encryptionKey,
    });

    const keys = storage.getAllKeys();
    return keys;
  };

  const clearAllKeys = async () => {
    const credentials = await Keychain.getGenericPassword(keychainOptions);
    if (!credentials) {
      return false;
    }

    const password = credentials.password;
    const encryptionKey = await sha256(password);
    const storage = new MMKV({
      id: customStorageId ?? storage_id,
      encryptionKey,
    });

    storage.clearAll();
    return true;
  };

  return {
    saveSecretKey,
    revealSecretKey,
    getAllStoredKeys,
    clearAllKeys,
  };
};
