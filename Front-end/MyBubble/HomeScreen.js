import * as React from 'react';
import { Button, View, Text, Dimensions, StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import GLOBAL from './global'

class HomeScreen extends React.Component{

  constructor(props) {

    super(props);

    this.state = {
      firstList : [],
      secondList : [],
      thirdList : [],
    };     

  }


  render(){

    const {navigation} = this.props;

    return (
      <View>
        
    <Text style={styles.text}>First: {this.state.firstList.length}</Text>
        <Text style={styles.text}>Second: {this.state.secondList.length}</Text>
        <Text style={styles.text}>Third: {this.state.thirdList.length}</Text>
        <View style={styles.button}>
        <Button
          title="Add Connection"
          onPress={() => {
            this.props.navigation.navigate('Search', {
              first: this.state.firstList,
              second : this.state.secondList,
              third : this.state.thirdList,
            });
            navigation.navigate('Search')
          }
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
        }
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