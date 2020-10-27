import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text} from 'react-native';

import MyStack from './MyStack';

const EntryPoint = () => {
    return (

      <NavigationContainer>
          <MyStack></MyStack>
      </NavigationContainer>
    );
  };
  export default EntryPoint;