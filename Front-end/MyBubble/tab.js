import 'react-native-gesture-handler';
import SettingsScreen from './SettingsScreen';
import CalendarScreen from './CalendarScreen';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();
const TabScreen = () => {
    return (
        <NavigationContainer>
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
            <Tab.Screen name="Calendar" component={CalendarScreen} />
        </Tab.Navigator>
        </NavigationContainer>
      );
  };
  export default TabScreen;