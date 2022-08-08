import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useAuthDispatch} from '../context/auth';
import {getGenericPassword} from '../storage/keychain';
import {storage} from '../storage/storage';
import {sha256} from '../handlers/hash';
import {logger} from '../handlers/logger';

type FormData = {
  password: string;
};

export const useSignin = () => {
  const {control, handleSubmit, setValue, setError} = useForm<FormData>();
  const {signin} = useAuthDispatch();

  const [enabledBiometry, setEnabledBiometry] = useState<boolean>(false);

  useEffect(() => {
    const _enabledBiometry = storage.getBoolean('biometrics');
    if (_enabledBiometry) {
      setEnabledBiometry(true);
    }
  }, []);

  const onSubmit = handleSubmit(async ({password}) => {
    logger('Signin');

    const hashedPassword = sha256(password);
    logger(`password: ${password}, hash: ${hashedPassword}`);

    const credentials = await getGenericPassword();
    if (credentials && credentials.password === hashedPassword) {
      logger('Login Ok');
      signin(hashedPassword);
      return true;
    }

    setError('password', {message: 'Password is different'});
    logger('Login NG. Password is different');
    return false;
  });

  const signinWithBiometry = async () => {
    logger('Signin with biometry');

    const credentials = await getGenericPassword();
    if (credentials) {
      logger('Login Ok');
      setValue('password', 'password');
      signin(credentials.password);
      return true;
    }

    logger('Login NG');
    return false;
  };

  return {
    control,
    onSubmit,
    signinWithBiometry,
    enabledBiometry,
  };
};
