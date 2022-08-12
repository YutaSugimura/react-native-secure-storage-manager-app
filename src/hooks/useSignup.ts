import {useRef} from 'react';
import {useForm} from 'react-hook-form';
import {useAuthDispatch} from '../context/auth';
import {setGenericPassword} from '../storage/keychain';
import {storage} from '../storage/storage';
import {sha256} from '../handlers/hash';
import {hapticFeedback} from '../handlers/hapticFeedback';
import {logger} from '../handlers/logger';

type FormData = {
  password: string;
  biometrics: boolean;
};

const defaultValues = {
  password: '',
  biometrics: false,
};

export const useSignup = () => {
  const {control, handleSubmit, watch} = useForm<FormData>({
    defaultValues,
  });
  const {signup} = useAuthDispatch();

  const biometricsValue = useRef({});
  biometricsValue.current = watch('biometrics');

  const onSubmit = handleSubmit(async ({password, biometrics}) => {
    logger('Signup');
    hapticFeedback('impactLight');

    const hashedPassword = sha256(password);
    logger(`password: ${password}, hash: ${hashedPassword}`);

    const result = await setGenericPassword(hashedPassword, biometrics);

    if (!result) {
      logger('Failed to execute setGenericPassword');
      return false;
    }
    logger(`Result setGenericPassword: ${result}`);

    storage.set('biometrics', biometrics);
    logger(`Save biometrics status. biometry is ${biometrics}`);

    signup(hashedPassword);
    return true;
  });

  return {
    control,
    biometricsValue,
    onSubmit,
  };
};
