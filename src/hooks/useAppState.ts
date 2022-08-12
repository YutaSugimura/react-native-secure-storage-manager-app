import {useEffect, useRef, useState} from 'react';
import {AppState} from 'react-native';

export const useAppState = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        __DEV__ && console.log('App has come to the foreground!');
      }

      if (
        appState.current.match(/inactive|active/) &&
        nextAppState === 'background'
      ) {
        __DEV__ && console.log('App has go to the background');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      __DEV__ && console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return appStateVisible;
};
