const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27018';

//Put a new user
router.put('/newUser', (req, res) => {
    const newUser = req.body;
    if(!newUser.id || !newUser.firstName || !newUser.lastName || typeof(newUser.healthStatus) == "undefined"){
        console.log("Failed");
        console.log(newUser);
        res.writeHead(412, {'Content-Type' : 'text-plain'});
        res.write('Failed: Missing User Fields!');
        res.send();
        return;
    }
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        console.log("adding to DB");
        console.log(newUser);
        const db = client.db("MyBubble");
        const user = {id: newUser.id, firstName: newUser.firstName, lastName: newUser.lastName,
            healthStatus: newUser.healthStatus, firstConnections: [], tempConnections: []};
            db.collection("users").insertOne(user, function(err, result) {
            if (err) throw err;
            res.writeHead(200, {'ContentType' : 'text/plain'});
            res.write("Success");
            res.end();
            client.close();
        });
    });
});


//Add conection by ID, respond only status code and success/failure message
router.post('/addConnectionById', (req, res) => {
    const userIDs = req.body;

    if(!userIDs.first || !userIDs.second){
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
});


//Search by ID return a JSON object for user
router.get('/getUserByID', (req, res) => {
    userID = req.body.id;
    console.log(req.body);
    if(!userID) {
        console.log("FAILURE");
        
        res.writeHead(412, {'Content-Type' : 'text-plain'});
        res.write('Failed: Missing User Fields!');
        res.send();
        return;
    }
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        console.log("Getting from DB");
        let user;
        const db = client.db("MyBubble");

        db.collection("users").findOne({id: userID}, (err, result) => {
            if (err) throw err;
            user = result;
        });

        res.json(user);
        res.send();
        client.close();
    });
});

module.exports = router;