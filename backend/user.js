const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const userModel = require('./userSchema');

const networkManager = require('./utils/networkManager.js');

const mongourl = require('./const.js').url;
const hsConst = require('./utils/healthStatusConst.js');

mongoose.connect(mongourl);

/* Puts a new user in the database, user must
 * have a first and last name. Takes arguments
 * as a JSON, if error sends a response w/ code
 * 402, otherwise returns 200, w/ a JSON representing
 * the new user. 
 */
router.put('/newUser', async(req, res) => {
    try {
        userFields = req.body;
        /* Attempt to create a new user with the given fields */
        user = await new userModel({firstName: userFields.firstName, lastName: userFields.lastName, email: userFields.email});
        await userModel.create(user); 
        res.send(user);
    } catch (err){
        res.writeHead(412);
        res.write(err.toString());
        res.send();
    }
});

router.get('/findByQuery', async(req, res) => {
    try {
        /* Simple find using the query */
        user = await userModel.find(req.query);
        res.json(user);
    }
    catch (err){
        res.writeHead(412);
        res.write(err.toString());
        res.send();
    }   
});

router.get('/findAllMatching', async(req, res) => {
    if(!req.query.searchString){
        res.writeHead(412, {'Content-Type' : 'text-plain'});
        res.write('Failed: Not given a search string');
        res.send();
        return;
    }
    try {
        let searchString = req.query.searchString.toString();
        /* Split into substrings by spaces */
        let subStrs = searchString.split(" ");

        let reg = '';
        /* Put together an OR regex of all substrings */
        if(subStrs.length > 1){
            reg = '('

            for (let i = 0; i < subStrs.length; i++){
                reg += subStrs[i];
                reg += (i == subStrs.length - 1) ? ')' : "|";
            }
        } else {
            reg = subStrs[0]; 
        }
        
        if(subStrs.length <= 1){
            /* If there is only one substring match first, last or email */
            users = await userModel.find()
            .or([{firstName: { $regex: '^' + reg, $options: 'i'}},
                {lastName: { $regex: '^' + reg, $options: 'i'}},
                {email: { $regex: '^' + reg, $options: 'i'}}]);
        } else {
            /* If there is multiple substrings match we refine the search criteria */
            users = await userModel.find()
            .and([{firstName: { $regex: '^' + reg, $options: 'i'}},
                {lastName: { $regex: '^' + reg, $options: 'i'}}])
        }

        res.json(users);
    }
    catch (err){
        res.writeHead(412);
        res.write(err.toString());
        res.send();
    }   
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

        if(!firstUser || !secondUser){
            let err = new Error('User not found');
            throw err;
        }

        /* Reject already connected users */
        if(firstUser.firstConnections.includes(secondUser._id.toString())){
            let err = new Error('Users already connected');
            throw err;
        }
        
        firstUser.firstConnections.push(secondUser._id.toString());
        secondUser.firstConnections.push(firstUser._id.toString());

        firstUser.temporaryConnections = await firstUser.temporaryConnections.filter(tc => tc._id.toString() != secondUser._id.toString());
        secondUser.temporaryConnections = await secondUser.temporaryConnections.filter(tc => tc._id.toString() != firstUser._id.toString());

        /* If there is a disparity between healthStatuses for the connected users we change the healthStatuses in the network */
        if(Math.abs(firstUser.healthStatus - secondUser.healthStatus) >= hsConst.differenceLevel.moderate){
            let lowerUser = (firstUser.healthStatus < secondUser.healthStatus) ? firstUser : secondUser;
            let higherUser = (firstUser.healthStatus > secondUser.healthStatus) ? firstUser : secondUser;

            let originalHealthStatus = higherUser.healthStatus;
            if(originalHealthStatus - lowerUser.healthStatus >= hsConst.differenceLevel.moderate){
                higherUser.healthStatus = lowerUser.healthStatus + hsConst.connectivityLevel.first;
            }

            if(originalHealthStatus - lowerUser.healthStatus >= hsConst.differenceLevel.major){
                await networkManager.updateHealthStatuses(higherUser.firstConnections, lowerUser.healthStatus + hsConst.connectivityLevel.second);   
            }

            if(originalHealthStatus - lowerUser.healthStatus >= hsConst.differenceLevel.immediate){
                let secondConnections = await networkManager.findSecondConnections(higherUser);
                await networkManager.updateHealthStatuses(secondConnections, lowerUser.healthStatus + hsConst.connectivityLevel.third); 
            }
            
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

        if(!user){
            let err = new Error('User not found');
            throw err;
        }

        let connections = await networkManager.findAllConnections(user);
        res.json(connections)

    } catch(err) {
        res.writeHead(412);
        res.write(err.toString());
        res.send();
    }
})

router.post('/addTemporaryConnection', async (req, res) =>{
    if(!req.body.firstID || !req.body.secondID || !req.body.date || (req.body.firstID == req.body.secondID)){

        res.writeHead(412, {'Content-Type' : 'text-plain'});
        res.write('Failed: Missing or Invalid Fields');
        res.send();
        return;
    }

    try {
        let currDate = new Date();
        let connectionDate = new Date(req.body.date);
        let dayDiff = (currDate - connectionDate)/(60 * 60 * 24 * 1000);

        /* Invalid dates or dates outside the isolation period are rejected */
        if(isNaN(new Date(req.body.date).valueOf()) || dayDiff > hsConst.isolationPeriod) {
            let err = new Error('Date not valid');
            throw err;
        }

        let firstUser = (await userModel.find({_id: req.body.firstID}))[0];
        let secondUser = (await userModel.find({_id: req.body.secondID}))[0];

        if(!firstUser || !secondUser){
            let err = new Error('User not found');
            throw err;
        }

        /* No point in adding a temp connection for a first level connection */
        if(firstUser.firstConnections.includes(req.body.secondID)){
            let err = new Error('Already a first level connection');
            throw err;
        }

        /* Can't create a temporary connection with the same user multiple times on the same date */
        for(let i = 0; i < firstUser.temporaryConnections.length; i++){
            let connection = firstUser.temporaryConnections[i];
            if(connection._id.toString() == secondUser._id.toString() && connection.date.toString() == req.body.date.toString()){
                let err = new Error('Already a temporary connection on this date');
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

        if(!user){
            let err = new Error('User not found');
            throw err;
        }

        let temporaryConnectionsDetails = [];

        let currDate = new Date();
        /* Filter out temporary connections that are past the isolation period */
        user.temporaryConnections = await user.temporaryConnections.filter((user) => {
            let connectionDate = new Date(user.date);
            let dayDiff = (currDate - connectionDate)/(60 * 60 * 24 * 1000);

            return (dayDiff < hsConst.isolationPeriod);
        });

        await user.save();

        /* Make a condensed list of information for all temporary connections */
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