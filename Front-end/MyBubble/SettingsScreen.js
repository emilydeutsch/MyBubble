import * as React from 'react';
import { Button, View, Text} from 'react-native';
import DropdownMenu from 'react-native-dropdown-menu';

class SettingsScreen extends React.Component{

  constructor(props) {

    super(props);

    this.state = {
      
      currentHealth : 'healthy',
    };      
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
        handler={(selection, row) => this.setState({currentHealth : healthState[selection][row]})}
        data = {healthState}
        >
          <Text>You are {this.state.currentHealth}</Text>
        </DropdownMenu>
      </View>
    );
  }
};
  export default SettingsScreen;