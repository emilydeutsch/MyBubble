const mongoose = require('mongoose');
const express = require('express');
const userModel = require('./schema');

const url = 'mongodb://localhost/mybubbletest-1';

const app = express();

mongoose.connect(url);

app.use(express.json());

app.put('/user/newUser', (req,res) => {
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

app.get('/user/find', (req, res) => {
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


app.listen(3000);