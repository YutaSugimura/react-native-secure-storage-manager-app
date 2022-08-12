import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuthState} from '../context/auth';
import {LoadingScreen} from '../Loading';
import {SignupScreen} from '../Signup';
import {SigninScreen} from '../Signin';
import MainNavigator from './main';

type StackParams = {
  Loading: undefined;
  Signup: undefined;
  Signin: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<StackParams>();

const Navigator: React.FC = () => {
  const state = useAuthState();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {state.isLoading ? (
        <Stack.Screen name="Loading" component={LoadingScreen} />
      ) : !state.isLogin ? (
        <>
          {state.isAccount ? (
            <Stack.Screen name="Signin" component={SigninScreen} />
          ) : (
            <Stack.Screen name="Signup" component={SignupScreen} />
          )}
        </>
      ) : (
        <Stack.Screen name="Main" component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default Navigator;
