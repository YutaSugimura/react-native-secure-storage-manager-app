import {ethers} from 'ethers';
import {generatePath} from '../handlers/generatePath';
import {useAuthState} from '../context/auth';
import {useWalletDispatch, useWalletState} from '../context/wallet';
import Encryptor from '../handlers/encryptor';
import {hapticFeedback} from '../handlers/hapticFeedback';
import {logger} from '../handlers/logger';
import {getSecretValue, setSecretValue} from '../storage/keychain';
import {storage} from '../storage/storage';

const encryptor = new Encryptor();

export const useCreateWallet = () => {
  const state = useAuthState();
  const {isWallet, accountList} = useWalletState();
  const {addAccount} = useWalletDispatch();

  const createWallet = async () => {
    logger('CREATE WALLET');
    hapticFeedback('impactLight');

    if (isWallet) {
      logger('wallet already exists');
      return false;
    }

    if (state.isLoading || !state.isLogin) {
      return false;
    }

    logger('start generate wallet');
    const wallet = ethers.Wallet.createRandom();

    const {
      address,
      privateKey,
      mnemonic: {path, phrase},
    } = wallet;
    logger(
      `generated wallet: ${JSON.stringify({
        address,
        privateKey,
        phrase,
        path,
      })}`,
    );

    const encryptionKey = state.encryptionKey;

    logger('******************** START ********************');
    const results = await Promise.all([
      (async () => {
        /**
         * set mnemonic on keychain
         */
        logger('**SET MNEMONIC ON KEYCHAIN**');

        const encryptedData = encryptor.encrypt(encryptionKey, phrase);

        if (!encryptedData) {
          logger('**SET MNEMONIC ON KEYCHAIN** encrypt failed');
          return false;
        }

        logger(
          `**SET MNEMONIC ON KEYCHAIN** encrypt ok; encryptionKey: ${encryptionKey}, encrypted data: ${JSON.stringify(
            encryptedData,
          )}`,
        );

        const result = await setSecretValue(
          'mnemonic',
          JSON.stringify(encryptedData),
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

        storage.set('isWallet', true);
        return true;
      })(),
      (async () => {
        /**
         * set account1 on keychain
         */
        logger('**SET ACCOUNT1 ON KEYCHAIN**');

        const encryptedData = encryptor.encrypt(
          encryptionKey,
          JSON.stringify({
            address,
            privateKey,
            path,
          }),
        );

        if (!encryptedData) {
          logger('**SET ACCOUNT1 ON KEYCHAIN** encrypt failed');
          return false;
        }

        logger(
          `**SET ACCOUNT1 ON KEYCHAIN** encrypt ok; encryptionKey: ${encryptionKey}, encrypted data: ${JSON.stringify(
            encryptedData,
          )}`,
        );

        const result = await setSecretValue(
          path,
          JSON.stringify(encryptedData),
        );

        if (!result) {
          logger('**SET ACCOUNT1 ON KEYCHAIN** keychain failed');
          return false;
        }

        logger(
          `**SET ACCOUNT1 ON KEYCHAIN** keychain ok; result: ${JSON.stringify(
            result,
          )}, key: ${path}, value: ${JSON.stringify(encryptedData)}`,
        );

        return true;
      })(),
    ]);

    logger('******************** END ********************');

    const newAccount = {address, path};
    addAccount(newAccount);
    logger('**FINISHED CREATE ACCOUNT** update accountList state and storage');

    return results[0] && results[1];
  };

  const createAccount = async () => {
    logger('CREATE ACCOUNT');
    hapticFeedback('impactLight');

    if (state.isLoading || !state.isLogin || !accountList) {
      return false;
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

    const encryptionKey = state.encryptionKey;
    const mnemonic = encryptor.decrypt(encryptionKey, {salt, iv, cipher});

    if (!mnemonic || !ethers.utils.isValidMnemonic(mnemonic)) {
      logger('decrypt failed');
      return false;
    }

    logger(`decrypt mnemonic: ${mnemonic}`);

    const accountCount = accountList.length;
    const path = generatePath(accountCount);
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);

    logger(
      `NEW ACCOUNT: ${JSON.stringify({
        address: wallet.address,
        privatekey: wallet.privateKey,
        path: wallet.mnemonic.path,
      })}`,
    );

    logger('**SET NEW ACCOUNT ON KEYCHAIN**');
    const encryptedData = encryptor.encrypt(
      encryptionKey,
      JSON.stringify({
        address: wallet.address,
        privateKey: wallet.privateKey,
        path,
      }),
    );

    if (!encryptedData) {
      logger('**SET NEW ACCOUNT ON KEYCHAIN** encrypt failed');
      return false;
    }

    logger(
      `**SET NEW ACCOUNT ON KEYCHAIN** encrypt ok; encryptionKey: ${encryptionKey}, encrypted data: ${JSON.stringify(
        encryptedData,
      )}`,
    );

    const result = await setSecretValue(path, JSON.stringify(encryptedData));

    if (!result) {
      logger('**SET NEW ACCOUNT ON KEYCHAIN** keychain failed');
      return false;
    }

    logger(
      `**SET NEW ACCOUNT ON KEYCHAIN** keychain ok; result: ${JSON.stringify(
        result,
      )}, key: ${path}, value: ${JSON.stringify(encryptedData)}`,
    );

    addAccount({address: wallet.address, path: wallet.mnemonic.path});
    logger(
      '**FINISHED CREATE NEW ACCOUNT** update accountList state and storage',
    );

    return true;
  };

  return {
    createWallet,
    createAccount,
  };
};
