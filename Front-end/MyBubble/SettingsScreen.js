import * as React from 'react';
import { Button,Alert,ImageBackground, View, StyleSheet,Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import GLOBAL from './global'
import QRCode from 'react-native-qrcode-svg';

const image = require('./images/backgroundMain.png');
class SettingsScreen extends React.Component{

  constructor(props) {

    super(props);

    this.state = {
      
      currentHealth : '',
      healthState : 0,
      
    };      
  }

  componentDidMount(){
    //Get health upon start
    fetch(GLOBAL.serverURL + '/healthStatus/pollHealthStatus?id=' + GLOBAL.userID, {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("health response: ", responseJson);
      GLOBAL.userHealth = responseJson.healthStatus;
    })
    .catch((error) => {
      console.error(error);
    });

    
    if(GLOBAL.userHealth == 0){
      this.setState({currentHealth : 'have covid'});
      this.setState({healthState : 1});
    }else{
      this.setState({currentHealth : 'are healthy'});
      this.setState({healthState : 0});
    }
    console.log("Current Health: ", GLOBAL.userHealth);
  }

  updateStatus = (selected) =>{

    //this.setState({currentHealth : selected});
    console.log("Selection: ", selected);
    console.log("current Health: ", this.state.currentHealth);
    let data = {
      id : GLOBAL.userID,
      healthStatus : "false",
    };
    this.setState({healthState : selected});
    if(selected == 1){
      data.healthStatus = "true";
      this.setState({currentHealth : 'have covid'});
    }
    else{
      data.healthStatus = "false";
      this.setState({currentHealth : 'are healthy'});
    }
    console.log("health state: ", this.state.healthState);
    console.log("Health:", data.healthStatus);

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
        <Picker testID = "picker"
        style = {{flex : 1,
                  height : 70,
                  width : 300,}}
                  
        //onValueChange={(selection, row) => this.updateStatus(selection, row, healthState)}
        onValueChange={(itemValue, itemIndex) => this.updateStatus(itemIndex)}
        selectedValue={healthState[0][this.state.healthState]}
        >
          <Picker.Item label = "healthy" value= 'healthy'/>
          <Picker.Item label = "covid" value= 'covid'/>   
        </Picker>
        <Text>You currently {this.state.currentHealth}</Text>

        <Text>Your MyBubble ID</Text>
        <QRCode
          value = {GLOBAL.userID.toString()}
        />
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