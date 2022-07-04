import {NativeModules} from 'react-native';
const {RNRandomBytes} = NativeModules;

type Callback = (error: any, bytes: string) => void;

interface RNRandomBytesInterface {
  randomBytes(size: number, callback: Callback): void;
}

export const randomBytes = (size: number): Promise<string> =>
  new Promise((resolve, reject) => {
    (RNRandomBytes as RNRandomBytesInterface).randomBytes(
      size,
      (error, bytes) => {
        if (error) {
          reject(error);
        } else {
          resolve(bytes);
        }
      },
    );
  });

export default RNRandomBytes as RNRandomBytesInterface;
