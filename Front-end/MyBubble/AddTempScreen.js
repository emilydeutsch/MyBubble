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

/**
 * Screen for searching users to add as a temporary
 * connection
 */
class AddTempScreen extends React.Component {
  
  constructor(props) {

      super(props);
      this.addSelection = this.addSelection.bind(this);

      //Keep track of search states
      this.state = {
        searchResult : '',
        dataName : '',
        dataUserID: '',
        selection : '',
        date : '',
      };     
   
    }

    /**
     * 
     * @param {*} item the item data from the flatlist
     * @param {*} index the index of the item in the flatlist
     * When called the item pressed has its ID taken and sent
     * to the server to be added as a connection
     */
    addSelection =(item, index) =>{
      const {navigation} = this.props;
      const {route} = this.props;
      const {date} = route.params;
      let userIDs = { 
        firstID : GLOBAL.userID,
        secondID : '',
        date: date,
      }
      
      console.log("added: " + item);

      //send PUT request and add connection to first connections
      userIDs.secondID = this.state.dataUserID[index];
      console.log("first user ID: " + userIDs.firstID);
      console.log("second user ID: " + userIDs.secondID);
      console.log("date: " + userIDs.date);
      var req = GLOBAL.serverURL + '/user/addTemporaryConnection';

      this.postRequest(req,userIDs);
      navigation.navigate('Calendar');
      }

    /**
     * 
     * @param {*} req address of the server for the post request
     * @param {*} data the data in the body of the post request
     * data should be a valid user ID to add to the server
     */
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
        if(responseJson[7] == 'D'){
          alert("Please choose a valid date");
        }else if(responseJson[0] == 'E'){
          alert("You Are Already Connected!");
        }else{
          alert('You added a new temporary connection');
        }
      })
      .catch((error) => {
        console.error(error);
      });
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

          alert("User Not Found");
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
    
    /**
     * 
     * @param {*} text the text to submit for searching
     * Text should be a valid name, containing letters, spaces
     * and dashes. If not throws an alert so the user can try
     * again
     */
    searchSubmit = (text) => {

      //Regex for valid strings
      if(/^[A-Za-z\s\-]+$/.test(text)){
      
        const request = GLOBAL.serverURL+'/user/findAllMatching?searchString='+text;

        this.getRequest(request);
        console.log("request: " + request);
        console.log("request data: " + this.state.data);

        this.setState({searchResult : this.state.dataName});
        
        console.log(this.state.searchResult);
      }else{
        alert("Please enter a valid name");
      }
    }

    /**
     * 
     * @param {*} obj object to check
     * Checks if the object is empty
     */
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
          ><Text style={styles.item} >{item}</Text>
          <Text style={styles.itemID}>ID: {this.state.dataUserID[index]}</Text>
          </TouchableOpacity></View>}
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
    itemID:{
      padding: 10,
      fontSize: 11,
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