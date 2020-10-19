const mongoose = require('mongoose');
const express = require('express');
const userModel = require('./schema');

const url = 'mongodb://localhost/project';

const app = express();

mongoose.connect(url);

app.use(express.json());

app.put('/user/newUser', (req,res) => {
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

app.get('/user/find', (req, res) => {
    console.log(req.query);
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

app.post('/user/addFirstConnection', async (req, res) => {
    console.log(req.body);
    if(!req.body.firstID || !req.body.secondID){
        res.writeHead(412, {'Content-Type' : 'text-plain'});
        res.write('Failed: Missing User IDs');
        res.send();
        return;
    }
    let firstUser = {foo: "bar"};
    let firstUserFound = false;
    firstUser = await userModel.find({_id: req.body.firstID})
    /*
    .exec((err, result) => {
        if (err) {
            res.writeHead(412);
            res.write(err.toString());
            res.send();
            return;
        }
        firstUser = result;
        firstUserFound = true;
    });
    */ 
    
    if(firstUser.firstConnections.includes(secondID)) {
        console.log(firstUser);
        res.writeHead(412);
        res.send();
        return;
    }
    let secondUser;
    let secondUserFound = false;
    await userModel.find({_id: req.body.secondID})
    /*
    .exec((err, result) => {
        if (err) {
            res.writeHead(412);
            res.write(err.toString());
            res.send();
            return;
        }
        secondUser = result;
        secondUserFound = true;
    }); 
    */
    firstUser.firstConnections.push(secondUser._id);
    secondUser.firstConnections.push(firstUser._id);
    await firstUser.save();
    await secondUser.save();
    res.writeHead(200);
    res.send();
});


app.listen(8080);