import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useAuth, type AuthState} from '../hooks/useAuth';

const AuthStateContext = createContext<AuthState>({isLoading: true});

// eslint-disable-next-line no-spaced-func
const AuthDispatchContext = createContext<{
  signup: (encryptionKey: string) => void;
  signin: (encryptionKey: string) => void;
  signout: () => void;
  clearAuth: () => void;
}>({
  signup: (_: string) => {},
  signin: (_: string) => {},
  signout: () => {},
  clearAuth: () => {},
});

type Props = {};

export const AuthProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
}) => {
  const {state, startup, signup, signin, signout, clearAuth} = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let cleanup = false;

    if (isLoading && !cleanup) {
      setIsLoading(true);
      startup();
    }

    return () => {
      cleanup = true;
    };
  }, [isLoading, startup]);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider
        value={{signup, signin, signout, clearAuth}}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
