import 'react-native-gesture-handler';
import SettingsScreen from './SettingsScreen';
import CalendarScreen from './CalendarScreen';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();
const TabScreen = () => {
    return (
        <NavigationContainer>
        <Tab.Navigator  
            initialRouteName="Home" 
            backBehavior="initialRoute" 
            tabBarOptions={{
                activeTintColor: '#ACD7CA',
            }}>
                <Tab.Screen 
                    name="Calendar" 
                    component={CalendarScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                          <MaterialCommunityIcons name="calendar-month" color={color} size={size} />
                        ),
                    }} 
                />
                <Tab.Screen 
                    name="Home" 
                    component={HomeStack} 
                    options={{
                        tabBarIcon: ({ color, size }) => (
                          <MaterialCommunityIcons name="google-circles-extended" color={color} size={size} />
                        ),
                    }} 
                />
                <Tab.Screen 
                name="Settings" 
                component={SettingsScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="account-settings" color={color} size={size} />
                    ),
                }} 
                />
                
        </Tab.Navigator>
        </NavigationContainer>
      );
  };
  export default TabScreen;