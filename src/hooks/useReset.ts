import {Alert} from 'react-native';
import {useAuthDispatch} from '../context/auth';
import {hapticFeedback} from '../handlers/hapticFeedback';
import {logger} from '../handlers/logger';
import {resetGenericPassword} from '../storage/keychain';
import {storage} from '../storage/storage';

export const useReset = () => {
  const {clearAuth} = useAuthDispatch();

  const onReset = async () => {
    logger('Confirm clear application data');
    hapticFeedback('impactHeavy');

    Alert.alert(
      'Clear application data',
      'Is it OK if the application data is deleted?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => hapticFeedback('impactMedium'),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            logger('Clear application data');
            hapticFeedback('impactHeavy');

            await resetGenericPassword();
            storage.clearAll();
            clearAuth();
          },
        },
      ],
    );
  };

  return {
    onReset,
  };
};
