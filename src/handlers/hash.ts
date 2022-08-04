import crypto from 'react-native-quick-crypto';

export const sha256 = (text: string) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};
