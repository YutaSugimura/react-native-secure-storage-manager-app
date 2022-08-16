import React, {createContext, PropsWithChildren, useContext} from 'react';
import {useAuth, type AuthState} from '../hooks/useAuth';

const AuthStateContext = createContext<AuthState>({isLoading: true});

// eslint-disable-next-line no-spaced-func
const AuthDispatchContext = createContext<{
  loadStorage: () => void;
  signup: (encryptionKey: string) => void;
  signin: (encryptionKey: string) => void;
  signout: () => void;
  updateEncryptionKey: (newEncryptionKey: string) => void;
  clearAuth: () => void;
}>({
  loadStorage: () => {},
  signup: (_: string) => {},
  signin: (_: string) => {},
  signout: () => {},
  updateEncryptionKey: () => {},
  clearAuth: () => {},
});

type Props = {};

export const AuthProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
}) => {
  const {
    state,
    loadStorage,
    signup,
    signin,
    signout,
    updateEncryptionKey,
    clearAuth,
  } = useAuth();

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider
        value={{
          loadStorage,
          signup,
          signin,
          signout,
          updateEncryptionKey,
          clearAuth,
        }}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
