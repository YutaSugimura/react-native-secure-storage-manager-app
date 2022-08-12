import {Reducer, useCallback, useReducer} from 'react';
import {storage} from '../storage/storage';

export type AuthState =
  | {
      isLoading: true;
    }
  | {
      isLoading: false;
      isAccount: boolean;
      isLogin: false;
    }
  | {
      isLoading: false;
      isAccount: true;
      isLogin: true;
      encryptionKey: string;
    };

type Action =
  | {
      type: 'STOP_LOADING';
      payload: {
        isAccount: boolean;
      };
    }
  | {
      type: 'SIGNUP';
      payload: {
        encryptionKey: string;
      };
    }
  | {
      type: 'SIGNIN';
      payload: {
        encryptionKey: string;
      };
    }
  | {
      type: 'SIGNOUT';
    }
  | {
      type: 'CLEAR_AUTH';
    };

const initialState: AuthState = {
  isLoading: true,
};

export const reducer: Reducer<AuthState, Action> = (_, action) => {
  switch (action.type) {
    case 'STOP_LOADING':
      return {
        isLoading: false,
        isAccount: action.payload.isAccount,
        isLogin: false,
      };
    case 'SIGNUP':
      return {
        isLoading: false,
        isAccount: true,
        isLogin: true,
        encryptionKey: action.payload.encryptionKey,
      };
    case 'SIGNIN':
      return {
        isLoading: false,
        isAccount: true,
        isLogin: true,
        encryptionKey: action.payload.encryptionKey,
      };
    case 'SIGNOUT':
      return {
        isLoading: false,
        isAccount: true,
        isLogin: false,
      };
    case 'CLEAR_AUTH':
      return {
        isLoading: false,
        isAccount: false,
        isLogin: false,
      };
  }
};

export const useAuth = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadStorage = useCallback(() => {
    const isAccount = storage.getBoolean('isAccount');

    dispatch({
      type: 'STOP_LOADING',
      payload: {isAccount: isAccount !== undefined ? isAccount : false},
    });
  }, []);

  const signup = useCallback((encryptionKey: string) => {
    dispatch({type: 'SIGNUP', payload: {encryptionKey}});
    storage.set('isAccount', true);
  }, []);

  const signin = useCallback((encryptionKey: string) => {
    dispatch({type: 'SIGNUP', payload: {encryptionKey}});
  }, []);

  const signout = useCallback(() => {
    dispatch({type: 'SIGNOUT'});
  }, []);

  const clearAuth = useCallback(() => {
    dispatch({type: 'CLEAR_AUTH'});
  }, []);

  return {
    state,
    loadStorage,
    signup,
    signin,
    signout,
    clearAuth,
  };
};
