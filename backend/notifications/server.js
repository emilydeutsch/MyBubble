const express = require('express');
const { admin } = require('./firebase-config');

const router = express.Router();

const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

router.post('/test', (req, res)=>{
    registrationToken = req.body.registrationToken;

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

