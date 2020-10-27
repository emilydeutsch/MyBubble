import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Dimensions, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import SettingsScreen from './SettingsScreen';
import CalendarScreen from './CalendarScreen';
import { block } from 'react-native-reanimated';

const Stack = createStackNavigator();

const screenwidth = Dimensions.get('screen').width;

const MyStack = () => {
  return (
    //<View>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
    </Stack.Navigator>
     //{/* Need a buffer to widen the screen so the app loads */}
     //<Text style={styles.container}></Text>
    //</View>
  );
};

const styles = StyleSheet.create({
  container:{
    width: screenwidth,
  },
});

export default MyStack;