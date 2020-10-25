const express = require('express');
const userRoute = require('./user.js');
const notificationRoute = require('/notifications/server')

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use('/user', userRoute);
//app.set('/notifications', notificationRoute)

app.listen(80);
