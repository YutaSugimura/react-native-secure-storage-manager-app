import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {ethers} from 'ethers';
import type {MainStackNavigationProps} from '../navigations/main';
import Encryptor from '../handlers/encryptor';
import {sha256} from '../handlers/hash';
import {generatePath} from '../handlers/generatePath';
import {hapticFeedback} from '../handlers/hapticFeedback';
import {logger} from '../handlers/logger';
import {
  getSecretValue,
  setGenericPassword,
  setSecretValue,
} from '../storage/keychain';
import {storage} from '../storage/storage';
import {useAuthDispatch} from '../context/auth';
import {Account} from './useWallet';

type FormData = {
  password: string;
  newPassword: string;
  biometrics: boolean;
};

type EncryptedData = {
  salt: string;
  iv: string;
  cipher: string;
};

const defaultValues = {
  password: '',
  biometrics: false,
};

const encryptor = new Encryptor();

export const useChangePassword = () => {
  const {goBack} = useNavigation<MainStackNavigationProps<'ChangePassword'>>();
  const {control, handleSubmit, watch, setError} = useForm<FormData>({
    defaultValues,
  });
  const {updateEncryptionKey} = useAuthDispatch();

  const onSubmit = handleSubmit(async ({password, newPassword, biometrics}) => {
    logger('Change Password');
    logger('******************** START ********************');
    hapticFeedback('impactLight');

    const hashedPassword = sha256(password);
    logger(`current password: ${password}, hash: ${hashedPassword}`);

    const encryptedMnemonicDataStrObj = await getSecretValue('mnemonic');
    if (!encryptedMnemonicDataStrObj) {
      setError('password', {message: 'Internal Errors'});
      logger('mnemonic does not exsits');
      return false;
    }

    logger(`keychain mnemonic data: ${encryptedMnemonicDataStrObj.password}`);
    const encryptedData = JSON.parse(
      encryptedMnemonicDataStrObj.password,
    ) as EncryptedData;

    const mnemonic = encryptor.decrypt(hashedPassword, encryptedData);
    if (!mnemonic) {
      setError('password', {message: 'password is not different'});
      logger('mnemonic does not exsits');
      return false;
    }

    const accounts: (Account & {privatekey: string})[] = [];

    let loop = true;
    let count = 0;
    while (loop) {
      const path = generatePath(count);
      const credenticals = await getSecretValue(path);

      if (!credenticals) {
        loop = false;
        break;
      }

      const encryptedAccountData = JSON.parse(
        credenticals.password,
      ) as EncryptedData;

      const rowData = encryptor.decrypt(hashedPassword, encryptedAccountData);
      if (!rowData || !rowData.includes('address:')) {
        count === 0 && setError('password', {message: 'Internal Errors'});
        loop = false;
        break;
      }

      const account = JSON.parse(rowData) as Account & {privatekey: string};
      const accountFromMnemonic = ethers.Wallet.fromMnemonic(mnemonic, path);
      if (account.address !== accountFromMnemonic.address) {
        loop = false;
        break;
      }

      accounts.push(account);
      count++;
    }

    logger(`decrypt accounts: ${accounts}`);
    const newHashedPassword = sha256(newPassword);
    logger(
      `new password: ${newPassword}, new encryptionkey: ${newHashedPassword}`,
    );

    const results = await Promise.all([
      (async () => {
        /**
         * set a new password on keychin
         */
        logger(`new password: ${newPassword}, hash: ${newHashedPassword}`);

        const result = await setGenericPassword(newHashedPassword, biometrics);

        if (!result) {
          logger('Failed to execute setGenericPassword');
          return false;
        }
        logger(`Result setGenericPassword: ${result}`);

        storage.set('biometrics', biometrics);
        logger(`Save biometrics status. biometry is ${biometrics}`);

        updateEncryptionKey(newHashedPassword);
        return true;
      })(),
      (async () => {
        /**
         * set a mnemonic with new password on keychain
         */
        logger('**SET MNEMONIC ON KEYCHAIN**');

        const newEncryptedData = encryptor.encrypt(newHashedPassword, mnemonic);
        if (!newEncryptedData) {
          logger('**SET MNEMONIC ON KEYCHAIN** encrypt failed');
          return false;
        }

        logger(
          `**SET MNEMONIC ON KEYCHAIN** encrypt ok; encryptionKey: ${newHashedPassword}, encrypted data: ${JSON.stringify(
            newEncryptedData,
          )}`,
        );

        const result = await setSecretValue(
          'mnemonic',
          JSON.stringify(newEncryptedData),
        );

        if (!result) {
          logger('**SET MNEMONIC ON KEYCHAIN** keychain failed');
          return false;
        }

        logger(
          `**SET MNEMONIC ON KEYCHAIN** keychain ok; result: ${JSON.stringify(
            result,
          )}, key: mnemonic`,
        );

        return true;
      })(),
      (async () => {
        /**
         * set an account data with new password on keychain
         */
        for (let i = 0; i < accounts.length; i++) {
          const account = accounts[i];
          const newEncryptedData = encryptor.encrypt(
            newHashedPassword,
            JSON.stringify(account),
          );
          if (!newEncryptedData) {
            logger(`**SET ACCOUNT${i} ON KEYCHAIN** encrypt failed`);
            return false;
          }

          logger(
            `**SET ACCOUNT${i} ON KEYCHAIN** encrypt ok; encryptionKey: ${newHashedPassword}, encrypted data: ${JSON.stringify(
              newEncryptedData,
            )}`,
          );

          const result = await setSecretValue(
            account.path,
            JSON.stringify(newEncryptedData),
          );

          if (!result) {
            logger(`**SET ACCOUNT${i} ON KEYCHAIN** keychain failed`);
            return false;
          }

          logger(
            `**SET ACCOUNT${i} ON KEYCHAIN** keychain ok; result: ${JSON.stringify(
              result,
            )}, key: ${account.path}, value: ${JSON.stringify(encryptedData)}`,
          );
        }

        return true;
      })(),
    ]);

    logger('******************** END ********************');
    logger(
      `results: new password: ${results[0]}, mnemonic: ${results[1]}, accounts: ${results[2]}`,
    );

    const response = results[0] && results[1] && results[2];
    response && goBack();
    return response;
  });

  return {
    control,
    watch,
    onSubmit,
  };
};
