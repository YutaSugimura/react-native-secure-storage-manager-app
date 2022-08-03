import crypto from 'react-native-quick-crypto';

export const randomBytes = (size: number): Buffer => {
  const value = crypto.randomBytes(size);
  return Buffer.from(value);
};
