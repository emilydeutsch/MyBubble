import * as React from 'react';
import { Button, View, Text, Dimensions, StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
    return (
      <View>
        
        <Text style={styles.text}>First: #</Text>
        <Text style={styles.text}>Second: #</Text>
        <Text style={styles.text}>Third: #</Text>
        <View style={styles.button}>
        <Button
          title="Add Connection"
          onPress={() =>
            navigation.navigate('Search')
          }
        />
        </View>
        <View style={styles.button}>
        <Button
          title="Settings"
          onPress={() =>
            navigation.navigate('Settings')
          }
        />
        </View>
        <View style={styles.button}>
        <Button
          title="Calendar"
          onPress={() =>
            navigation.navigate('Calendar')
          }
        />
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    button:{
      margin: 25,
      paddingBottom: 10,
    },
    text:{
      margin: 25,
      paddingBottom: 10,
    },
  });

export default HomeScreen;