import crypto from 'react-native-quick-crypto';
import {randomBytes} from './randomBytes';

const algorithm = 'aes-256-cbc';

export default class Encryptor {
  generateSalt = (byteCount: number) => {
    return randomBytes(byteCount);
  };

  generateKey = (password: string, salt: string) => {
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
  };

  encrypt = (password: string, text: string) => {
    const salt = this.generateSalt(32).toString('hex');
    const key = this.generateKey(password, salt);
    const iv = this.generateSalt(16);

    try {
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(text);
      const array = [encrypted, cipher.final()] as Uint8Array[];
      encrypted = Buffer.concat(array);

      return {
        salt,
        iv: iv.toString('hex'),
        cipher: Buffer.from(encrypted).toString('hex'),
      };
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  decrypt = (
    password: string,
    encryptedData: {salt: string; iv: string; cipher: string},
  ) => {
    const salt = encryptedData.salt;
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const cipher = Buffer.from(encryptedData.cipher, 'hex');

    const key = this.generateKey(password, salt);

    try {
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(cipher);
      const array = [decrypted, decipher.final()] as Uint8Array[];
      decrypted = Buffer.concat(array);

      return decrypted.toString();
    } catch (e) {
      console.log(e);
      return false;
    }
  };
}
