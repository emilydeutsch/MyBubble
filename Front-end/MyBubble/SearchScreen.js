import * as React from 'react';
import { View, Text, TextInput, FlatList, StyleSheet} from 'react-native';
import { State } from 'react-native-gesture-handler';

class SearchScreen extends React.Component {

    constructor(props) {

      super(props);

      this.state = {
        searchResult : "",
      };      
    }

    searchSubmit = (text) => {
      

      const textArr = text.split("\n");
      
      {/* Enter code here for searching database using text string */}
      this.setState({searchResult : textArr});
      console.log(this.state.searchResults);
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
            renderItem={({item, index}) => {return <View><Text style={styles.item} >{item}</Text></View>}}
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