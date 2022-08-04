import {Reducer, useCallback, useReducer} from 'react';
import {storage} from '../storage/storage';

export type Account = {
  address: string;
  path: string;
};

export type WalletState =
  | {
      isLoading: true;
      isWallet: false;
      accountList?: Account[];
    }
  | {
      isLoading: false;
      isWallet: false;
      accountList?: Account[];
    }
  | {
      isLoading: false;
      isWallet: true;
      accountList: Account[];
    };

type Action =
  | {
      type: 'STOP_LOADING';
      payload: {isWallet: true; accountList: Account[]} | {isWallet: false};
    }
  | {
      type: 'ADD_ACCOUNT';
      payload: {account: Account};
    }
  | {
      type: 'RESTORE';
    };

const initialState: WalletState = {
  isLoading: true,
  isWallet: false,
};

const reducer: Reducer<WalletState, Action> = (state, action) => {
  switch (action.type) {
    case 'STOP_LOADING': {
      if (action.payload.isWallet) {
        return {
          isLoading: false,
          isWallet: true,
          accountList: action.payload.accountList,
        };
      }

      return {
        isLoading: false,
        isWallet: false,
      };
    }
    case 'ADD_ACCOUNT': {
      if (state.isWallet) {
        return {
          isLoading: false,
          isWallet: true,
          accountList: [...state.accountList, action.payload.account],
        };
      }

      return {
        isLoading: false,
        isWallet: true,
        accountList: [action.payload.account],
      };
    }
    case 'RESTORE':
      return {
        ...initialState,
      };
  }
};

export const useWallet = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startup = useCallback((isWallet: boolean, accountList?: Account[]) => {
    if (isWallet && accountList) {
      dispatch({
        type: 'STOP_LOADING',
        payload: {isWallet, accountList},
      });

      return;
    }

    dispatch({type: 'STOP_LOADING', payload: {isWallet: false}});
  }, []);

  const addAccount = useCallback(
    (newAccount: Account) => {
      dispatch({type: 'ADD_ACCOUNT', payload: {account: newAccount}});

      const newList = state.accountList
        ? [...state.accountList, newAccount]
        : [newAccount];
      storage.set('accountList', JSON.stringify(newList));
    },
    [state.accountList],
  );

  const resetAccount = useCallback(() => {
    dispatch({type: 'RESTORE'});
  }, []);

  return {
    state,
    startup,
    addAccount,
    resetAccount,
  };
};
