const express = require('express');
const { admin } = require('./firebase-config');

const router = express.Router();

const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

router.post('/test', (req, res)=>{
    registrationToken = "c_BjmPdxQNKB8r5tyqdNz6:APA91bERc3Q0x6EjLa4OWaMy6IeZLFMcFpvCAasIvt7u5_L8airHThuVk8_C2aMKp4gngCdq07B3Qg51ZXhuMWVk9ahvi5QO7L8afQk2bgVJq199jC8d7gt30PFFPPxO09vnfoAiFF21";

    const message = {
      data : {
        notifee: JSON.stringify({
          body: 'This message was sent via FCM!',
          android: {
            channelId: 'default',
            actions: [
              {
                title: 'Mark as Read',
                pressAction: {
                  id: 'read',
                },
              },
            ],
          },
        })
      },
      notification : {
        body: "this is a notification",
        title: "it sure is",
      },
    }

    const options =  notification_options
    
      admin.messaging().sendToDevice(registrationToken, message, options)
      .then( response => {

        console.log(message);
        res.status(200).send("Notification sent successfully")
       
      })
      .catch( error => {
          console.log(error);
      });

})

module.exports = router;

