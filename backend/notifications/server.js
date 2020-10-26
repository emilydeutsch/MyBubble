const express = require('express');
const { admin } = require('./firebase-config');

const router = express.Router();

const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

router.post('/test', (req, res)=>{
    const  registrationToken = "AAAAvVhhZSM:APA91bEE1X5U7KJYi7-uz_4Df2RdkxkJeOKxXPmAMrClQSCF4_RLJkWhAJVOunKUzsUySpT6KgkUFRCG6n7uoIP7hz_Wiso56qe2nXS2jazgUbuoJGYSeqazI-lYw8WbXiScui_5HT6B"
    const message = {
      data : {},
      notification : {
        body: "this is a notification",
        title: "it sure is",
      },
    }
    
    const options =  notification_options
    
      admin.messaging().sendToDevice(registrationToken, message, options)
      .then( response => {

        res.status(200).send("Notification sent successfully")
       
      })
      .catch( error => {
          console.log(error);
      });

})

module.exports = router;

