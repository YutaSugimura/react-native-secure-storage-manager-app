import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {WalletProvider} from '../context/wallet';
import {useAppState} from '../hooks/useAppState';
import {WalletScreen} from '../Wallet';
import {ChangePassowrdScreen} from '../ChangePassword';
import {BackgroundScreen} from '../Background';

type MainStackParamList = {
  Wallet: undefined;
  ChangePassword: undefined;
  Background: undefined;
};

export type MainStackScreen = keyof MainStackParamList;
export type MainStackNavigationProps<T extends MainStackScreen> =
  NativeStackNavigationProp<MainStackParamList, T>;

const Stack = createNativeStackNavigator<MainStackParamList>();

const Navigator: React.FC = () => {
  const appStateVisible = useAppState();

  return (
    <WalletProvider>
      <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
        {appStateVisible === 'active' ? (
          <>
            <Stack.Screen name="Wallet" component={WalletScreen} />
            <Stack.Group screenOptions={{presentation: 'modal'}}>
              <Stack.Screen
                name="ChangePassword"
                component={ChangePassowrdScreen}
              />
            </Stack.Group>
          </>
        ) : (
          <Stack.Screen name="Background" component={BackgroundScreen} />
        )}
      </Stack.Navigator>
    </WalletProvider>
  );
};

export default Navigator;
