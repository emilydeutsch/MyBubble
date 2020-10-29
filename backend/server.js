const express = require('express');
const userRoute = require('./user.js');
const notificationRoute = require('./notifications/server.js');
const healthStatusRoute = require('./healthStatus.js');

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use('/user', userRoute);
app.use('/healthStatus', healthStatusRoute)
app.use('/notifications', notificationRoute)

app.listen(8080);
