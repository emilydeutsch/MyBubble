import * as React from 'react';
import { Button,Alert,ImageBackground, View, StyleSheet,Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DropdownMenu from 'react-native-dropdown-menu';
import GLOBAL from './global'
const image = require('./images/backgroundMain.png');
class SettingsScreen extends React.Component{

  constructor(props) {

    super(props);

    this.state = {
      
      currentHealth : 'healthy',
      
    };      
  }

  updateStatus = (selected) =>{

    this.setState({currentHealth : selected});

    let data = {
      id : GLOBAL.userID,
      healthStatus : false,
    };

    if(this.state.currentHealth == 'covid'){
      data.healthStatus = true;
    }
    else{
      data.healthStatus = false;
    }

    req = GLOBAL.serverURL + '/healthStatus/updateHealthStatus';

    fetch(req, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log("POST response" + responseJson);
        alert('You changed your health status');
      })
      .catch((error) => {
        console.error(error);
      });

  }

  render(){
    var healthState = [['healthy', 'covid']];
    return (
      
    <View style= {styles.container} >
      <ImageBackground source={image} style={styles.image}>  
        <Text style={styles.text}>Health Status</Text>
        <Text>Select your health status:</Text>
        <Picker 
        style = {{flex : 1,
                  height : 70,
                  width : 300,}}
                  
        //onValueChange={(selection, row) => this.updateStatus(selection, row, healthState)}
        onValueChange={(itemValue, itemIndex) => this.updateStatus(itemValue)}
        selectedValue={this.state.currentHealth}
        >
          <Picker.Item label = "healthy" value= 'healthy'/>
          <Picker.Item label = "covid" value= 'covid'/>   
        </Picker>
        <Text>You are {this.state.currentHealth}</Text>
        </ImageBackground>
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
    fontSize: 35,
    fontWeight: "bold"
  },
  container: {
    flex: 1,
    flexDirection: "column"
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: 'center',
  },
});
  export default SettingsScreen;