const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
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
    user = new userModel({firstName: userFields.firstName, lastName: userFields.lastName});
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
            firstUser[0].firstConnections.push(secondUser[0]._id);
            secondUser[0].firstConnections.push(firstUser[0]._id);
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


module.exports = router;