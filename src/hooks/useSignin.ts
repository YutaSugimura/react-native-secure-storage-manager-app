import {useEffect, useState} from 'react';
import {useAuthDispatch} from '../context/login';
import {getGenericPassword} from '../storage/keychain';
import {storage} from '../storage/storage';
import {sha256} from '../handlers/hash';
import {logger} from '../handlers/logger';

export const useSignin = () => {
  const [inputValue, setInputValue] = useState<string>();
  const [enabledBiometry, setEnabledBiometry] = useState<boolean>(false);

  const {signin} = useAuthDispatch();

  useEffect(() => {
    const _enabledBiometry = storage.getBoolean('biometry');
    if (_enabledBiometry) {
      setEnabledBiometry(true);
    }
  }, []);

  const onSubmit = async () => {
    logger('Signin');
    if (!inputValue) {
      logger('password does not exist');
      return false;
    }

    const password = inputValue;
    const hashedPassword = sha256(password);
    logger(`password: ${password}, hash: ${hashedPassword}`);

    const credentials = await getGenericPassword();
    if (credentials && credentials.password === hashedPassword) {
      logger('Login Ok');
      signin(hashedPassword);
      return true;
    }

    logger('Login NG. Password is different');
    return false;
  };

  const signinWithBiometry = async () => {
    logger('Signin with biometry');

    const credentials = await getGenericPassword();
    if (credentials) {
      logger('Login Ok');
      setInputValue('password');
      signin(credentials.password);
      return true;
    }

    logger('Login NG');
    return false;
  };

  return {
    value: inputValue,
    onChangeText: setInputValue,
    onSubmit,
    signinWithBiometry,
    enabledBiometry,
  };
};
