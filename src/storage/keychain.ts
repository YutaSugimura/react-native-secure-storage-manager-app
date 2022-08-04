import * as Keychain from 'react-native-keychain';

export const USER = 'securestorage_app';
export const SERVICE = 'encryption_key_service';

export const keychainOptions = (biometry?: boolean): Keychain.Options => {
  if (biometry) {
    return {
      service: SERVICE,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    };
  }

  return {
    service: SERVICE,
  };
};

export const setGenericPassword = async (
  password: string,
  biometry?: boolean,
) => {
  return await Keychain.setGenericPassword(
    USER,
    password,
    keychainOptions(biometry),
  );
};

export const getGenericPassword = async () => {
  return await Keychain.getGenericPassword({service: SERVICE});
};

export const resetGenericPassword = async () => {
  return await Keychain.resetGenericPassword({service: SERVICE});
};

export const setSecretValue = async (key: string, secretValue: string) => {
  return await Keychain.setInternetCredentials(key, key, secretValue, {
    service: SERVICE,
  });
};

export const getSecretValue = async (key: string) => {
  return await Keychain.getInternetCredentials(key, {service: SERVICE});
};

export const hasSecretValue = async (key: string) => {
  return await Keychain.hasInternetCredentials(key);
};

export const resetSecretValue = async (key: string) => {
  return await Keychain.resetInternetCredentials(key, {service: SERVICE});
};
