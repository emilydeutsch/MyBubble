import * as React from 'react';
import { StyleSheet,Button,Image,ImageBackground, FlatList, View, Text} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GLOBAL from './global';
const image = require('./images/backgroundMain.png');
var badgeImages = [
  require('./images/badge0purple.png'),
  require('./images/badge1red.png'),
  require('./images/badge2orange.png'),
  require('./images/badge3yellow.png'),
  require('./images/badge4green.png'),
];

/**
 * Screen to display a calender of the current month.
 * Used so user can add temporary connections in last 
 * two weeks or anytime in the future
 */
class CalendarScreen extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      date : '',
      dataName: '',
      dataHealth : '',
    };     
  }

    /**
     * 
     * @param {*} req address of the server to send get request
     * Used to return a list of found users from a search
     */
  getRequest = (req) =>{
    console.log(req);
    fetch(req, {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("GET response: " + responseJson);
      if((responseJson || []).length === 0){
        this.setState({searchResult : ['Not Found']});
      }else{

        var nameArr = [];
        var healthArr = [];
        var i;
        for(i = 0; i < responseJson.length; i++){
          if(responseJson[i].date == this.state.date){
          nameArr.push(responseJson[i].firstName + " " + responseJson[i].lastName);
          healthArr.push(responseJson[i].healthStatus);
          }
        }
        
        this.setState({
          dataName: nameArr,
          dataHealth : healthArr,
        })
        console.log("dataName" + this.state.dataName);
      }
      
    })
    .catch((error) => {
      console.error(error);
    });
  }


  render(){

    const {navigation} = this.props;

    return (
    <View style={styles.container} >
      <ImageBackground source={image} style={styles.image}>
      <Calendar
      onDayPress={day => {
          this.setState({ date: day.dateString })
          const request = GLOBAL.serverURL+'/user/getTemporaryConnections?_id='+GLOBAL.userID;
          this.getRequest(request);
          }}
      enableSwipeMonths={true}
      markedDates={{
        [this.state.date]: { selected: true },
        }}
      theme={{
        selectedDayBackgroundColor: '#ACD7CA',
        todayTextColor: '#ACD7CA',
        dotColor: '#ACD7CA',
        selectedDayTextColor: 'white',
        monthTextColor: '#ACD7CA',
        arrowColor: '#ACD7CA',
      }}
    />
      <Icon.Button testID = 'add_tmp'
          name="account-plus"
          backgroundColor="#ACD7CA"
          onPress={() => {
            navigation.navigate('Add Temporary Connection',{
              date: this.state.date,
            })
            console.log("date: " + this.state.date);
          }}
            >
          Add Temporary Connection
        </Icon.Button>
        <View  style={{flex: 1, flexDirection: 'row'}} >
      <FlatList
        data={this.state.dataName}
        
        renderItem={({item, index}) => {
          return <View  style={{flex: 1, flexDirection: 'row'}} >
          <Text style={styles.item} >{item}</Text>
          </View>
          }}  
      />
      <FlatList
        data={this.state.dataHealth}
        
        renderItem={({item, index}) => {
          return <View  style={{flex: 1, flexDirection: 'row',padding:5}} >
          <Image style = {styles.badge} source={badgeImages[item]}/>  
          </View>
          }}  
      />
      </View>
      </ImageBackground>
    </View>
    );
      }
  };
  const styles = StyleSheet.create({
    container: {
     flex: 1,
     flexDirection: "column"
    },
    image: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
    badge:{
      width: 34,
      height: 34,
    }
  });
  export default CalendarScreen;