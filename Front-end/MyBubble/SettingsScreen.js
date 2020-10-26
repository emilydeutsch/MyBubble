import * as React from 'react';
import { Button,Alert, View, Text} from 'react-native';
import DropdownMenu from 'react-native-dropdown-menu';
import GLOBAL from './global'

class SettingsScreen extends React.Component{

  constructor(props) {

    super(props);

    this.state = {
      
      currentHealth : 'healthy',
      
    };      
  }

  updateStatus = (selection, row, healthState) =>{

    this.setState({currentHealth : healthState[selection][row]});

    let data = {
      id : GLOBAL.userID,
      healthStatus : false,
    }

    if(this.state.currentHealth == 'covid'){
      data.healthStatus = true
    }

    req = 'http://charlieserver.eastus.cloudapp.azure.com/user/updateHealthStatus';

    fetch(req, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log("PUT response" + responseJson);
        alert('You changed your health status');
      })
      .catch((error) => {
        console.error(error);
      });

  }

  render(){
    var healthState = [['healthy', 'covid']];
    return (
      
    <View style={{flex : 1}}>
        <Text style={{paddingBottom : 25}}>Health Status</Text>
        <Text>Select your health status:</Text>
        <DropdownMenu 
        useNativeDriver = 'true'
        style = {{flex : 1,
                  height : 64,
                  width : 100,}}
        tintColor={'#666666'}
        activityTintColor={'green'}
        handler={(selection, row) => this.updateStatus(selection, row, healthState)}
        data = {healthState}
        >
          <Text>You are {this.state.currentHealth}</Text>
        </DropdownMenu>
      </View>
    );
  }
};
  export default SettingsScreen;