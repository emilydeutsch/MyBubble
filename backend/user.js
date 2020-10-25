const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const { findOneAndUpdate } = require('./schema');
const userModel = require('./schema');

const url = 'mongodb://localhost:27018/mybubbletest-1';
mongoose.connect(url);

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
        firstUser = await userModel.find({_id: req.body.firstID}).exec();
        secondUser = await userModel.find({_id: req.body.secondID}).exec();

        if(!firstUser[0].firstConnections.includes(secondUser[0]._id)){
            firstUser[0].firstConnections.push(secondUser[0]._id.toString());
            secondUser[0].firstConnections.push(firstUser[0]._id.toString());
        }
        
        await firstUser[0].save();
        await secondUser[0].save();

        res.json(firstUser.concat(secondUser));
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
    let user, firstConnections;
    let secondConnections;
    let thirdConnections;

    try {
        user = await userModel.find({_id: userID});
        
        firstConnections = user[0].firstConnections;

        secondConnections = [];

        for(let i = 0; i < firstConnections.length; i++) {
            let id = firstConnections[i];
            let currUser = await userModel.findById(id);
          
            for(let j = 0; j < currUser.firstConnections.length; j++) {
                connected_id = currUser.firstConnections[j].toString();

                if(!firstConnections.includes(connected_id) && connected_id != userID && !secondConnections.includes(connected_id)){
                    secondConnections.push(connected_id);
                }
            }
        }

        thirdConnections = [];
        for(let i = 0; i < secondConnections.length; i++) {
            let id = secondConnections[i];
            let currUser = await userModel.findById(id);
          
            for(let j = 0; j < currUser.firstConnections.length; j++) {
                connected_id = currUser.firstConnections[j].toString();

                if(!firstConnections.includes(connected_id) && connected_id != userID && !secondConnections.includes(connected_id) 
                    && !thirdConnections.includes(connected_id)){
                    thirdConnections.push(connected_id);
                }
            }
        }

        let allConnections = {firstConnections, secondConnections, thirdConnections}
        res.json(allConnections)

    } catch(err) {
        res.writeHead(412);
        res.write(err.toString());
        res.send();
    }

})

router.post('/updateHealthStatus', async (req, res) => {
    if(!req.body.id || req.body.healthStatus == undefined){
        res.writeHead(412, {'Content-Type' : 'text-plain'});
        res.write('Failed: Missing Fields or invalid');
        res.send();
        return;
    }

    let user, firstConnections;
    let secondConnections;
    let thirdConnections;

    try{
        user = await userModel.findOneAndUpdate({_id : req.body.id}, {healthStatus: req.body.healthStatus, covidFlag: req.body.healthStatus});
        user.healthStatus = req.body.healthStatus;

        if(!user.healthStatus){
            res.json(user);
            return;
        }

        let count  = 0;

        firstConnections = user.firstConnections;
        secondConnections = [];

        for(let i = 0; i < firstConnections.length; i++) {
            let id = firstConnections[i];
            let currUser = await userModel.findById(id);
            currUser.covidFlag = true;
            count++;
            await currUser.save();

            for(let j = 0; j < currUser.firstConnections.length; j++) {
                connected_id = currUser.firstConnections[j].toString();

                if(!firstConnections.includes(connected_id) && connected_id != req.body.id && !secondConnections.includes(connected_id)){
                    secondConnections.push(connected_id);
                }
            }
        }

        thirdConnections = [];
        for(let i = 0; i < secondConnections.length; i++) {
            let id = secondConnections[i];
            let currUser = await userModel.findById(id);
            currUser.covidFlag = true;
            count++;
            await currUser.save();

            for(let j = 0; j < currUser.firstConnections.length; j++) {
                connected_id = currUser.firstConnections[j].toString();

                if(!firstConnections.includes(connected_id) && connected_id != req.body.id && !secondConnections.includes(connected_id) 
                    && !thirdConnections.includes(connected_id)){

                    thirdConnections.push(connected_id);
                }
            }
        }

        for(let i = 0; i < thirdConnections.length; i++) {
            let id = thirdConnections[i];
            let currUser = await userModel.findById(id);
            currUser.covidFlag = true;
            count++;
            await currUser.save();
        }        

        res.json({count});

    } catch (err){
        res.writeHead(412);
        res.write(err.toString());
        res.send();
    }
})

module.exports = router;