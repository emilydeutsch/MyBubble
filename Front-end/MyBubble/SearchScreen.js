import * as React from 'react';
import { View, Text, TextInput, FlatList, StyleSheet} from 'react-native';
import { State } from 'react-native-gesture-handler';

class SearchScreen extends React.Component {

  constructor(props) {

      super(props);

      this.state = {
        searchResult : '',
        data : '',
        selection : '',
      };      
    }

    componentDidMount = (req) =>{
      fetch(req, {
        method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          data: responseJson[0].firstName + " " + responseJson[0].lastName
        })
      })
      .catch((error) => {
        console.error(error);
      });
    }

    searchSubmit = (text) => {
      
      const request = 'http://charlieserver.eastus.cloudapp.azure.com/user/findByQuery?firstName='+text;

      this.componentDidMount(request);

      console.log(this.state.data);

      var textArr = this.state.data;
      
      {/* Enter code here for searching database using text string */}
      this.setState(state =>({
        searchResult : [state.data],
      }) );
      console.log(this.state.searchResult);
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
              return <View><Text style={styles.item} >{item}</Text></View>}
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