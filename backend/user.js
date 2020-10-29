const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const { findOneAndUpdate, update } = require('./userSchema');
const userModel = require('./userSchema');
const _ = require('lodash');

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
        firstUser = await userModel.find({_id: req.body.firstID});
        secondUser = await userModel.find({_id: req.body.secondID});

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
    let invalidItems;

    try {
        user = await userModel.find({_id: userID});
        
        firstConnections = user[0].firstConnections;

        secondConnections = [];
        invalidItems = [];

        invalidItems.push(userID.toString());
        invalidItems = invalidItems.concat(firstConnections);

        for(let i = 0; i < firstConnections.length; i++) {
            let id = firstConnections[i];
            let currUser = await userModel.findById(id);
          
            secondConnections = _.union(secondConnections, currUser.firstConnections);
        }

        console.log(invalidItems);
        console.log(secondConnections);

        secondConnections = secondConnections.filter(connection => !invalidItems.includes(connection));
        invalidItems = invalidItems.concat(secondConnections);

        thirdConnections = [];
        for(let i = 0; i < secondConnections.length; i++) {
            let id = secondConnections[i];
            let currUser = await userModel.findById(id);
          
            thirdConnections = _.union(thirdConnections, currUser.firstConnections);
        }

        thirdConnections = thirdConnections.filter(connection => !invalidItems.includes(connection));

        let allConnections = {firstConnections, secondConnections, thirdConnections}
        res.json(allConnections)

    } catch(err) {
        res.writeHead(412);
        res.write(err.toString());
        res.send();
    }

})

module.exports = router;