const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const userModel = require('./schema');

const url = 'mongodb://localhost/project';
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
router.post('/addConnectionById', (req, res) => {
    /*
    const userIDs = req.body;

    if(!userIDs.firstID || !userIDs.secondID){
        res.writeHead(412, {'Content-Type' : 'text-plain'});
        res.write('Failed: Missing User IDs');
        res.send();
        return;
    }

    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const db = client.db("MyBubble");
        let user1List;
        let user2List;

        db.collection("users").findOne({id: userIDs.first}, (err, result) => {
            console.log(result);
            if (err) throw err;
            user1List = result.firstConnections;
        });
        db.collection("users").findOne({id: userIDs.second}, (err, result) => {
            if (err) throw err;
            user2List = result.firstConnections;
        });

        if(user1List.includes(userIDs.second)){
            res.writeHead(412, {'Content-Type' : 'text-plain'});
            res.write('Failed: Already Connected');
            res.send();
            client.close();
            return;
        }

        user1List.push(userIds.second);
        let user1Mod = { $set: {firstConnections: user1List} };
        user2List.push(userIds.first);
        let user2Mod = { $set: {firstConnections: user2List} };

        db.collection("users").updateOne({id:userIDs.first}, user1Mod, (err, res) => {
            if (err) throw err;
        });
        db.collection("users").updateOne({id:userIDs.second}, user2Mod, (err, res) => {
            if (err) throw err;
        });

        res.writeHead(200, {'Content-Type' : 'text-plain'});
        res.write("Success");
        res.send();
        client.close();
    });
    */
   res.writeHead(412);
   res.send();
});


module.exports = router;