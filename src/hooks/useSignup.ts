import {useState} from 'react';
import {useAuthDispatch} from '../context/login';
import {setGenericPassword} from '../storage/keychain';
import {storage} from '../storage/storage';
import {logger} from '../handlers/logger';
import {sha256} from '../handlers/hash';

export const useSignup = () => {
  const [inputValue, setInputValue] = useState<string>();
  const [isBiometry, setIsBiometry] = useState<boolean>(false);

  const {signup} = useAuthDispatch();

  const biometrySwitchToggle = () => {
    setIsBiometry(prev => !prev);
  };

  const onSubmit = async () => {
    logger('Signup');
    if (!inputValue) {
      logger('password does not exist');
      return false;
    }

    const password = inputValue;
    const hashedPassword = sha256(password);
    logger(`password: ${password}, hash: ${hashedPassword}`);

    const result = await setGenericPassword(hashedPassword, isBiometry);

    if (!result) {
      logger('Failed to execute setGenericPassword');
      return false;
    }
    logger(`Result setGenericPassword: ${result}`);

    storage.set('biometry', isBiometry !== undefined ? isBiometry : false);
    logger(`Save biometry status. biometry is ${isBiometry}`);

    signup(hashedPassword);
    return true;
  };

  return {
    value: inputValue,
    onChangeText: setInputValue,
    isBiometry,
    biometrySwitchToggle,
    onSubmit,
  };
};
