import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './main';

const Navigator: React.FC = () => {
  return (
    <NavigationContainer onReady={() => console.log('start')}>
      <MainNavigator />
    </NavigationContainer>
  );
};

export default Navigator;
