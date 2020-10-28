import * as React from 'react';
import { View, Text,SafeAreaView, ImageBackground, TextInput, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import { State } from 'react-native-gesture-handler';
import { SearchBar } from 'react-native-elements';
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

class SearchScreen extends React.Component {

  constructor(props) {

      super(props);
      this.addSelection = this.addSelection.bind(this);

      this.state = {
        searchResult : '',
        dataName : '',
        dataUserID: '',
        selection : '',
      };     
   
    }
    
    addSelection =(item, index) =>{

      let userIDs = {
        firstID : GLOBAL.userID,
        secondID : '',
      }
      alert('You added a new connection');
      console.log("added: " + item);

      //send PUT request and add connection to first connections
      userIDs.secondID = this.state.dataUserID;
      console.log("first user ID: " + userIDs.firstID);
      console.log("second user ID: " + userIDs.secondID);

      req = 'http://charlieserver.eastus.cloudapp.azure.com/user/addFirstConnection'

      this.putRequest(req,userIDs);
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
        }
        
      })
      .catch((error) => {
        console.error(error);
      });
    }
    
    searchSubmit = (text) => {
      
      const request = 'http://charlieserver.eastus.cloudapp.azure.com/user/findByQuery?firstName='+text;

      this.getRequest(request);

      console.log("request data: " + this.state.data);

      //this.setState({dataName : text});
      
      {/* Enter code here for searching database using text string */}

      this.setState({searchResult : this.state.dataName});
      
      console.log(this.state.searchResult);
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
    return (
      
      <View style= {styles.container} >
      <ImageBackground source={image} style={styles.image}>       
            <TextInput
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

export default SearchScreen;