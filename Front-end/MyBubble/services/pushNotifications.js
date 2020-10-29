import PushNotification from 'react-native-push-notification';

const configure = () => {
 PushNotification.configure({

   onRegister: function(token) {
     //process token
   },

   onNotification: function(notification) {
       
    console.log("NOTIFICATION:", notification);

     // process the notification
     // required on iOS only
     //notification.finish(PushNotificationIOS.FetchResult.NoData);
   },

   popInitialNotification: true,
   requestPermissions: true,

 });
};

const localNotification = () => {
    console.log("In Notification");
    PushNotification.localNotification({
      channelId: 'default-channel-id',
      autoCancel: true,
      largeIcon: "ic_launcher",
      smallIcon: "ic_notification",
      bigText: "My big text that will be shown when notification is expanded",
      subText: "This is a subText",
      color: "green",
      vibrate: true,
      vibration: 300,
      title: "Notification Title",
      message: "Notification Message",
      playSound: true,
      soundName: 'default',
      actions: '["Accept", "Reject"]',
    });
   };



export {
 configure,
 localNotification,
};
