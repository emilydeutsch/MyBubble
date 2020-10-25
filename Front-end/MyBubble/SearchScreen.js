import * as React from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import { State } from 'react-native-gesture-handler';
import GLOBAL from './global'

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
          this.setState({
            dataName: responseJson[0].firstName + " " + responseJson[0].lastName,
            dataUserID : responseJson[0]._id,
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

      this.setState({searchResult : [this.state.dataName]});
      
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
      
      <View>       
        <View>  
          
            <TextInput
              placeholder= "Search..."
              returnKeyType='search'
              onSubmitEditing={(event) => this.searchSubmit(event.nativeEvent.text)}
            />
        </View>
        <View>
          <FlatList
            data = {this.state.searchResult}
            renderItem={({item, index}) => {
              return <View><TouchableOpacity
                onPress={() => this.addSelection(item,index)}
              ><Text style={styles.item} >{item}</Text></TouchableOpacity></View>}
            }
            extraData = {this.state.searchResult}
          />
        </View>
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
      width: 400,
    }
  })

export default SearchScreen;