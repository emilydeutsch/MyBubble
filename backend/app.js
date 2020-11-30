const express = require('express');
const userRoute = require('./user.js');
const healthStatusRoute = require('./healthStatus.js');

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use('/user', userRoute);
app.use('/healthStatus', healthStatusRoute)

module.exports = {app};