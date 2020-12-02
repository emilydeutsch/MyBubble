import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import AddTempScreen from './AddTempScreen';
import CalendarScreen from './CalendarScreen';

/**
 * Set up the navigation stack for the 
 * calendar to travel between the calendar
 * and the add connections page 
 */
const Stack = createStackNavigator();
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Add Temporary Connection" component={AddTempScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;