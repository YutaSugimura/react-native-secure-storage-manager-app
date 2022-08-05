import {useAuthDispatch} from '../context/auth';
import {logger} from '../handlers/logger';
import {resetGenericPassword} from '../storage/keychain';
import {storage} from '../storage/storage';

export const useReset = () => {
  const {clearAuth} = useAuthDispatch();

  const onReset = async () => {
    logger('reset auth');
    await resetGenericPassword();
    storage.clearAll();
    clearAuth();
  };

  return {
    onReset,
  };
};
