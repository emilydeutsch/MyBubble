import * as React from 'react';
import { Button,Alert,ImageBackground, View, StyleSheet,Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import GLOBAL from './global'
import QRCode from 'react-native-qrcode-svg';

const image = require('./images/backgroundMain.png');

/**
 * Screen that contains the user settings. Here user can
 * update their health status, view their ID and QR code ID.
 */
class SettingsScreen extends React.Component{

  constructor(props) {

    super(props);

    //Keep track of the current users health status
    this.state = {
      
      currentHealth : '',
      healthState : 0,
      
    };      
  }

  /**
   * Run when this page loads
   * Updates user's health status for the current session
   */
  componentDidMount(){
    //Update the users health from the server upon start
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

    //Update text according to health
    if(GLOBAL.userHealth == 0){
      this.setState({currentHealth : 'have covid'});
      this.setState({healthState : 1});
    }else{
      this.setState({currentHealth : 'are healthy'});
      this.setState({healthState : 0});
    }
    console.log("Current Health: ", GLOBAL.userHealth);
  }

  /**
   * 
   * @param {*} selected the element selected fromm the list
   * to update the health status
   */
  updateStatus = (selected) =>{

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
    //Possible health options
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
                  
        onValueChange={(itemValue, itemIndex) => this.updateStatus(itemIndex)}
        selectedValue={healthState[0][this.state.healthState]}
        >
          <Picker.Item label = "healthy" value= 'healthy'/>
          <Picker.Item label = "covid" value= 'covid'/>   
        </Picker>
        <Text style={styles.healthText}>You currently {this.state.currentHealth}</Text>

        <Text style={styles.idText}>Your MyBubble ID:</Text>
        <Text style={styles.idText}>{GLOBAL.userID}</Text>
        <View style={styles.qr}>
        <QRCode
          value = {GLOBAL.userID.toString()}
        />
        </View>
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
  healthText:{
    paddingBottom:100,
  },
  idText:{
    paddingBottom:20,
    fontWeight: "bold"
  },
  qr:{
    paddingBottom:20,
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