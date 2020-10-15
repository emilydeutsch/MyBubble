import React from 'react';
import { Button, Text, View } from 'react-native';

const HelloWorldApp = () => {
  return (
    <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Text>Hello, world!!!</Text>
      <Button title= "hello">
        
      </Button>
    </View>
  );
}

export default HelloWorldApp;
