import {randomBytes as rb} from 'react-native-randombytes';

export const randomBytes2 = (size: number) => {
  return rb(size);
};
