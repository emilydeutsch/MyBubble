import * as React from 'react';
import { View, Button, Text,ImageBackground, Dimensions, StyleSheet} from 'react-native';
import PushNotification from 'react-native-push-notification';
import GLOBAL from './global'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const image = require('./images/backgroundMain.png');

class HomeScreen extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      firstList : [],
      secondList : [],
      thirdList : [],
    };     

    this.NewNotification = this.NewNotification.bind(this);
  }

  

  updateConnections = () =>{
    
    //Update the connections
    fetch(GLOBAL.serverURL + '/user/getAllConnections?_id='+GLOBAL.userID, {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({firstList : responseJson.firstConnections});
      this.setState({secondList : responseJson.secondConnections});
      this.setState({thirdList : responseJson.thirdConnections});
    })
    .catch((error) => {
      console.error(error);
    });
  }

  updateHealth = () =>{
    var changed = false;
    //Update health status
    fetch(GLOBAL.serverURL + '/healthStatus/pollHealthStatus?_id=' + GLOBAL.userID, {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      changed = JSON.stringify(responseJson).changed;
      GLOBAL.userHealth = JSON.stringify(responseJson).healthStatus;
    })
    .catch((error) => {
      console.error(error);
    });

    //Send health alert if user status has changed
    if(changed){
      this.HealthAlert();
    }
  }

  componentDidMount(){
    
    PushNotification.createChannel(
      {
        channelId: "channel-1", // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.configure({
      
      // (required) Called when a remote or local notification is opened or received
      onNotification: notification => {
          console.log(notification);
          
        },
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
    });
    PushNotification.getChannels(function (channel_ids) {
      console.log(channel_ids); // ['channel_id_1']
    });
    this.interval = setInterval(() => this.updateHealth(), 10000);
    this.interval = setInterval(() => this.updateConnections(), 1000);
  }

  NewNotification(){
    
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: "channel-1", // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
      ticker: "My Notification Ticker", // (optional)
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
      largeIconUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
      smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
      bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
      subText: "This is a subText", // (optional) default: none
      bigPictureUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
      color: "red", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: "some_tag", // (optional) add tag to message
      group: "group", // (optional) add group to message
      groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      priority: "high", // (optional) set notification priority, default: high
      visibility: "private", // (optional) set notification visibility, default: private
      ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
      shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
      onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
      
      when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
      timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
     
      messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 
     
      actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
     
      /* iOS only properties */
      alertAction: "view", // (optional) default: view
      category: "", // (optional) default: empty string
     
      /* iOS and Android properties */
      id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: "My Notification Title", // (optional)
      message: "My Notification Message", // (required)
      userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
      playSound: false, // (optional) default: true
      soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: 1, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    });
    PushNotification.popInitialNotification((notification) => {
      console.log('Initial Notification', notification);
    });
    PushNotification.getScheduledLocalNotifications((callback) => {
      console.log('Scheduled Notifications:', callback);
    });
    PushNotification.getDeliveredNotifications((callback) => {
      console.log('Delivered Notifications:', callback);
    });
    PushNotification.cancelAllLocalNotifications();
    PushNotification.removeAllDeliveredNotifications();

  }

  HealthAlert(){
    
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: "channel-1", // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
      ticker: "My Notification Ticker", // (optional)
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
      largeIconUrl: "", // (optional) default: undefined
      smallIcon: "ic_launcher", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
      bigText: "Someone in your bubble has contracted COVID-19", // (optional) default: "message" prop
      subText: "", // (optional) default: none
      bigPictureUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
      color: "white", // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: "some_tag", // (optional) add tag to message
      group: "group", // (optional) add group to message
      groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      priority: "high", // (optional) set notification priority, default: high
      visibility: "private", // (optional) set notification visibility, default: private
      ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
      shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
      onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
      
      when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
      timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
     
      messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 
     
      actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
     
      /* iOS only properties */
      alertAction: "view", // (optional) default: view
      category: "", // (optional) default: empty string
     
      /* iOS and Android properties */
      id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: "Health Alert", // (optional)
      message: "My Notification Message", // (required)
      userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
      playSound: false, // (optional) default: true
      soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: 1, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      repeatType: "", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    });
    PushNotification.popInitialNotification((notification) => {
      console.log('Initial Notification', notification);
    });
    PushNotification.getScheduledLocalNotifications((callback) => {
      console.log('Scheduled Notifications:', callback);
    });
    PushNotification.getDeliveredNotifications((callback) => {
      console.log('Delivered Notifications:', callback);
    });
    
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  render(){

    const {navigation} = this.props;

    return (
      <View style= {styles.container} >
    <ImageBackground source={image} style={styles.image}>    
        <Text style={styles.text}>First: {this.state.firstList.length}</Text>
        <Text style={styles.text}>Second: {this.state.secondList.length}</Text>
        <Text style={styles.text}>Third: {this.state.thirdList.length}</Text>
      <View style={styles.button}>
        <Icon.Button
          name="account-plus"
          backgroundColor="#ACD7CA"
          onPress={() => {
            this.props.navigation.navigate('AddConnection', {
              first: this.state.firstList,
              second : this.state.secondList,
              third : this.state.thirdList,
            });
            navigation.navigate('AddConnection')
          }}
            >
          Add Connection
        </Icon.Button>
        <Button
          onPress={()=>{this.NewNotification()}}
          title="Show Notification"
        />
        <Button
          onPress={()=>{this.HealthAlert()}}
          title="Health Alert"
        />
        </View>
      
        </ImageBackground>
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
      fontSize: 35,
      fontWeight: "bold"
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
  });

export default HomeScreen;