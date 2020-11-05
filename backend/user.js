const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const userModel = require('./userSchema');

const networkManager = require('./utils/networkManager.js');

const mongourl = require('./const.js').url;
mongoose.connect(mongourl);

/* Puts a new user in the database, user must
 * have a first and last name. Takes arguments
 * as a JSON, if error sends a response w/ code
 * 402, otherwise returns 200, w/ a JSON representing
 * the new user. 
 */
router.put('/newUser', (req,res) => {
    userFields = req.body;
    user = new userModel({firstName: userFields.firstName, lastName: userFields.lastName, email: userFields.email});
    userModel.create(user, (err, result) => {
        if (err){
            res.writeHead(412);
            res.write(err.toString());
            res.send();
        } else {
            res.json(result);
        }
    });
});

router.get('/findByQuery', (req, res) => {
    userModel.find(req.query).exec((err, result) => {
        if(err) {
            res.writeHead(412);
            res.write(err.toString());
            res.send();
        } else {
            res.json(result);
        }
    })
});

//Add conection by ID, respond only status code and success/failure message
router.post('/addFirstConnection', async (req, res) => {
    if(!req.body.firstID || !req.body.secondID || req.body.firstID == req.body.secondID){
        res.writeHead(412, {'Content-Type' : 'text-plain'});
        res.write('Failed: Missing User IDs or invalid');
        res.send();
        return;
    }

    let firstUser, secondUser;

    try {
        firstUser = (await userModel.find({_id: req.body.firstID}))[0];
        secondUser = (await userModel.find({_id: req.body.secondID}))[0];

        if(!firstUser.firstConnections.includes(secondUser._id)){
            firstUser.firstConnections.push(secondUser._id.toString());
            secondUser.firstConnections.push(firstUser._id.toString());
        }
        
        await firstUser.save();
        await secondUser.save();

        let retArray = [firstUser, secondUser];
        res.json(retArray);
    }
    catch(err){
        res.writeHead(412);
        res.write(err.toString());
        res.send();
    }
});

router.get('/getAllConnections', async (req, res) => {
    if(!req.query._id){
        res.writeHead(412, {'Content-Type' : 'text-plain'});
        res.write('Failed: Missing User IDs or invalid');
        res.send();
        return;
    }

    let userID = req.query._id;

    try {
        let user = (await userModel.find({_id: userID}))[0];
        let connections = await networkManager.findAllConnections(user);
        res.json(connections)

    } catch(err) {
        res.writeHead(412);
        res.write(err.toString());
        res.send();
    }
})

router.post('/addTemporaryConnection', async (req, res) =>{
    if(!req.body.firstID || !req.body.secondID || !req.body.date){
        res.writeHead(412, {'Content-Type' : 'text-plain'});
        res.write('Failed: Missing Fields');
        res.send();
        return;
    }

    try {
        let firstUser = (await userModel.find({_id: req.body.firstID}))[0];
        let secondUser = (await userModel.find({_id: req.body.secondID}))[0];

        if(firstUser.firstConnections.includes(req.body.secondID)){
            let err = new Error('Already a first level connection');
            throw err;
        }

        for(let i = 0; i < firstUser.temporaryConnections.length; i++){
            if(firstUser.temporaryConnections[i]._id.toString() == secondUser._id.toString()){
                let err = new Error('Already a temporary connection');
                throw err;
            }
        }

        let tempConnectionForFirst = {_id: secondUser._id.toString(), date: req.body.date}
        let tempConnectionForSecond = {_id: firstUser._id.toString(), date: req.body.date}

        firstUser.temporaryConnections.push(tempConnectionForFirst)
        secondUser.temporaryConnections.push(tempConnectionForSecond)

        await firstUser.save();
        await secondUser.save();

        let retArray = [firstUser, secondUser];
        res.json(retArray);
    } catch(err){
        res.writeHead(412);
        res.write(err.toString());
        res.send();
    }
})

router.get('/getTemporaryConnections', async (req, res) => {
    if(!req.query._id){
        res.writeHead(412, {'Content-Type' : 'text-plain'});
        res.write('Failed: Missing User IDs or invalid');
        res.send();
        return;
    }

    let userID = req.query._id;

    try {
        let user = (await userModel.find({_id: userID}))[0];
        let temporaryConnectionsDetails = [];

        for(let i = 0; i < user.temporaryConnections.length; i++){
            let connectedUser = (await userModel.find({_id: user.temporaryConnections[i]._id}))[0];

            temporaryConnectionsDetails.push({
                _id: connectedUser._id,
                date: user.temporaryConnections[i].date,
                firstName: connectedUser.firstName,
                lastName: connectedUser.lastName,
                healthStatus: connectedUser.healthStatus,
            });
        }

        res.json(temporaryConnectionsDetails)

    } catch(err) {
        res.writeHead(412);
        res.write(err.toString());
        res.send();
    }
})

module.exports = router;