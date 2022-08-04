import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
} from 'react';
import {type Account, useWallet, type WalletState} from '../hooks/useWallet';
import {storage} from '../storage/storage';

const WalletStateContext = createContext<WalletState>({
  isLoading: true,
  isWallet: false,
});

const WalletDispatchContext = createContext<{
  addAccount: (newAccount: Account) => void;
  resetAccount: () => void;
}>({
  addAccount: (_: Account) => {},
  resetAccount: () => {},
});

type Props = {};

export const WalletProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
}) => {
  const {state, startup, addAccount, resetAccount} = useWallet();

  useEffect(() => {
    let cleanup = false;

    if (!cleanup && state.isLoading) {
      const isWallet = storage.getBoolean('isWallet');

      if (isWallet) {
        const _accountList = storage.getString('accountList');
        const accountList = _accountList ? JSON.parse(_accountList) : undefined;
        startup(isWallet, accountList);
      }
    }

    return () => {
      cleanup = true;
    };
  }, [state.isLoading, startup]);

  return (
    <WalletStateContext.Provider value={state}>
      <WalletDispatchContext.Provider value={{addAccount, resetAccount}}>
        {children}
      </WalletDispatchContext.Provider>
    </WalletStateContext.Provider>
  );
};

export const useWalletState = () => useContext(WalletStateContext);
export const useWalletDispatch = () => useContext(WalletDispatchContext);
