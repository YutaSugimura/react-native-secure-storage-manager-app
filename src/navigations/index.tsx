import React, {useCallback} from 'react';
import {useColorScheme} from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {useAuthDispatch} from '../context/auth';
import AppNavigator from './app';

const Navigator: React.FC = () => {
  const isDarkTheme = useColorScheme() === 'dark';
  const {loadStorage} = useAuthDispatch();

  const onReady = useCallback(() => {
    loadStorage();
  }, [loadStorage]);

  return (
    <NavigationContainer
      onReady={onReady}
      theme={isDarkTheme ? DarkTheme : DefaultTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default Navigator;
