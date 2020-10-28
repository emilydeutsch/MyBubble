import * as React from 'react';
import { Button, View, Text, Dimensions, StyleSheet} from 'react-native';
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

  updateConnections = () =>{

    fetch('http://charlieserver.eastus.cloudapp.azure.com/user/getAllConnections?_id='+GLOBAL.userID, {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({firstList : responseJson.firstConnections});
      this.setState({secondList : responseJson.secondConnections});
      this.setState({thirdList : responseJson.thirdConnections});
    })
    .catch((error) => {
      console.error(error);
    });
  }

  UNSAFE_componentWillMount(){
    this.interval = setInterval(() => this.updateConnections(), 1000);
  }

  componentWillUnmount(){
    clearInterval(this.interval);
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
            this.props.navigation.navigate('AddConnection', {
              first: this.state.firstList,
              second : this.state.secondList,
              third : this.state.thirdList,
            });
            navigation.navigate('AddConnection')
          }
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