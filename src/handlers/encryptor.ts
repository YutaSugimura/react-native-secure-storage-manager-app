import Aes from 'react-native-aes-crypto';
import {randomBytes} from '../randomBytes';

export default class Encryptor {
  generateSalt = async (byteCount = 64) => {
    return await randomBytes(byteCount);
  };

  generateKey = async (password: string, salt: string) => {
    return await Aes.pbkdf2(password, salt, 5000, 256);
  };

  keyFromPassword = async (password: string, salt: string) => {
    return await this.generateKey(password, salt);
  };

  encrypt = async (password: string, string: string) => {
    try {
      const salt = await this.generateSalt();
      const key = await this.keyFromPassword(password, salt);
      const iv = await this.generateSalt(64);

      const cipher = await Aes.encrypt(string, key, iv, 'aes-256-cbc');
      return JSON.stringify({cipher, iv, salt});
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  decrypt = async (password: string, encryptedObjStr: string) => {
    try {
      const encryptedData = JSON.parse(encryptedObjStr);
      const key = await this.keyFromPassword(password, encryptedData.salt);

      const rowData = await Aes.decrypt(
        encryptedData.cipher,
        key,
        encryptedData.iv,
        'aes-256-cbc',
      );
      return rowData;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
}
