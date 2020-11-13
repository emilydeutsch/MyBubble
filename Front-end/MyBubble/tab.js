import 'react-native-gesture-handler';
import SettingsScreen from './SettingsScreen';
import CalendarScreen from './CalendarScreen';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import HomeStack from './HomeStack';
import CalendarStack from './CalendarStack';

const Tab = createBottomTabNavigator();
const TabScreen = () => {
    return (
        <NavigationContainer>
        <Tab.Navigator  
            initialRouteName="Home" 
            backBehavior="initialRoute" 
            tabBarOptions={{
                activeTintColor: '#ACD7CA',
                keyboardHidesTabBar: true,
                style: { height: '9%',elevation: 10, }
            }}>
                <Tab.Screen 
                    name="Calendar" 
                    component={CalendarStack}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                          <MaterialCommunityIcons name="calendar-month" color={color} size={35} testID="calendar"/>
                        ),
                    }} 
                />
                <Tab.Screen 
                    name="Home" 
                    component={HomeStack} 
                    options={{
                        tabBarIcon: ({ color, size }) => (
                          <MaterialCommunityIcons name="google-circles-extended" color={color} size={35} testID="home"/>
                        ),
                    }} 
                />
                <Tab.Screen
                name="Settings" 
                component={SettingsScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="account-settings" color={color} size={35} testID="settings"/>
                    ),
                }} 
                />
                
        </Tab.Navigator>
        </NavigationContainer>
      );
  };
  export default TabScreen;