'use strict';

import React, { Component } from 'react';
import GLOBAL from './global'
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

class CameraScreen extends Component {
  onSuccess = (e) => {
    // Linking.openURL(e.data).catch(err =>
    //   console.error('An error occured', err)
    // );

    const {navigation} = this.props;
      let userIDs = {
        firstID : GLOBAL.userID,
        secondID : '',
      }
      userIDs.secondID = e.data;
      //alert('You added a new connection');
      console.log("added: " + userIDs.secondID);

      var req = GLOBAL.serverURL + '/user/addFirstConnection';

      this.postRequest(req,userIDs);
      navigation.navigate('Home');

  };

  postRequest = (req, data) =>{
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
      
      if(responseJson[0] == 'E'){
        alert("Users Already Connected");
      }else if(responseJson[0] == 'C'){
        alert('Invalid ID');
      }else{
        alert('You added a new connection');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess}
        flashMode={RNCamera.Constants.FlashMode.torch}
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});

export default CameraScreen;