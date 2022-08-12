import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppState} from '../hooks/useAppState';
import {WalletScreen} from '../Wallet';
import {BackgroundScreen} from '../Background';

type MainStackParams = {
  Wallet: undefined;
  Background: undefined;
};

const Stack = createNativeStackNavigator<MainStackParams>();

const Navigator: React.FC = () => {
  const appStateVisible = useAppState();

  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
      {appStateVisible === 'active' ? (
        <Stack.Screen name="Wallet" component={WalletScreen} />
      ) : (
        <Stack.Screen name="Background" component={BackgroundScreen} />
      )}
    </Stack.Navigator>
  );
};

export default Navigator;
