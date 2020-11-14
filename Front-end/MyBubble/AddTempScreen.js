import * as React from 'react';
import { View, Text,SafeAreaView, ImageBackground, TextInput, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import { State } from 'react-native-gesture-handler';
import GLOBAL from './global'
const image = require('./images/backgroundMain.png');

const ItemSeparatorView = () => {
  return (
    // Flat List Item Separator
    <View
      style={{
        height: 0.5,
        width: '100%',
        backgroundColor: '#C8C8C8',
      }}
    />
  );
};

class AddTempScreen extends React.Component {
  
  constructor(props) {

      super(props);
      this.addSelection = this.addSelection.bind(this);

      this.state = {
        searchResult : '',
        dataName : '',
        dataUserID: '',
        selection : '',
        date : '',
      };     
   
    }
    
    addSelection =(item, index) =>{
      const {navigation} = this.props;
      const {route} = this.props;
      const {date} = route.params;
      let userIDs = { 
        firstID : GLOBAL.userID,
        secondID : '',
        date: date,
      }
      alert('You added a new temporary connection');
      console.log("added: " + item);

      //send PUT request and add connection to first connections
      userIDs.secondID = this.state.dataUserID[index];
      console.log("first user ID: " + userIDs.firstID);
      console.log("second user ID: " + userIDs.secondID);
      console.log("date: " + userIDs.date);
      var req = GLOBAL.serverURL + '/user/addTemporaryConnection';

      this.putRequest(req,userIDs);
      navigation.navigate('Calendar');
      }

    putRequest = (req, data) =>{
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
        
      })
      .catch((error) => {
        console.error(error);
      });
    }

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
          var idarr = [];
          var i;
          for(i = 0; i < responseJson.length; i++){
            nameArr.push(responseJson[i].firstName + " " + responseJson[i].lastName);
            idarr.push(responseJson[i]._id);
          }
          
          this.setState({
            dataName: nameArr,
            dataUserID : idarr,
          })
          this.setState({searchResult : this.state.dataName});
        }
        
      })
      .catch((error) => {
        console.error(error);
      });
    }
    
    searchSubmit = (text) => {

      if(/^[A-Za-z\s\-]+$/.test(text)){
      
        const request = GLOBAL.serverURL+'/user/findByQuery?firstName='+text;

        this.getRequest(request);
        console.log("request: " + request);
        console.log("request data: " + this.state.data);

        //this.setState({dataName : text});
        
        {/* Enter code here for searching database using text string */}

        this.setState({searchResult : this.state.dataName});
        
        console.log(this.state.searchResult);
      }else{
        alert("Please enter a valid name");
      }
    }

    isEmpty =(obj) =>{
      for(var prop in obj){
        if(obj.hasOwnProperty(prop)){
          return false;
        }
      }
      return JSON.stringify(obj) === JSON.stringify({});
    }

    render(){
      const {navigation} = this.props;
      
    return (
      
      <View style= {styles.container} >
      <ImageBackground source={image} style={styles.image}>       
            <TextInput testID = 'search'
            keyboardShouldPersistTaps={"always"}
            blurOnSubmit={false} 
              placeholder= "Search"
              returnKeyType='search'
              style={styles.textInputStyle}
              onSubmitEditing={(event) => this.searchSubmit(event.nativeEvent.text)}
              underlineColorAndroid="transparent"
            />
          <SafeAreaView style={styles.container}>
      <FlatList
        data={this.state.searchResult}
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='on-drag'
        renderItem={({item, index}) => {
          return <View><TouchableOpacity
            onPress={() => this.addSelection(item,index)}
          ><Text style={styles.item} >{item}</Text></TouchableOpacity></View>}
        }
        ItemSeparatorComponent={ItemSeparatorView}
          />
          </SafeAreaView>
        </ImageBackground>
      </View>
    );
    }
  }
  

  const styles = StyleSheet.create({
    item:{
      padding: 10,
      fontSize: 18,
      height: 44,
      color: 'black',
      width: 370,
      backgroundColor:'white'
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
    textInputStyle: {
      height: 40,
      borderWidth: 1,
      marginTop: 50,
      paddingLeft: 20,
      margin: 5,
      width:375,
      borderColor: "#ACD7CA",
      backgroundColor: '#FFFFFF',
    },
  })

export default AddTempScreen;