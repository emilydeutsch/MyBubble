const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const { findOneAndUpdate, update } = require('./userSchema');
const userModel = require('./userSchema');
const _ = require('lodash');

const mongourl = require('./const.js').url;
mongoose.connect(mongourl);

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

    let newHealthStatus = req.body.healthStatus ? 0 : 4;

    try{
        user = (await userModel.find({_id : req.body.id}))[0];
        
        user.healthStatus = newHealthStatus;
        user.healthStatus = newHealthStatus;
        user.save();

        if(newHealthStatus == 4){
            res.json(user);
            return;
        }
        
        firstConnections = user.firstConnections;

        secondConnections = [];
        invalidItems = [];

        invalidItems.push(req.body.id.toString());
        invalidItems = invalidItems.concat(firstConnections);

        for(let i = 0; i < firstConnections.length; i++) {
            let id = firstConnections[i];
            let currUser = await userModel.findById(id);
          
            secondConnections = _.union(secondConnections, currUser.firstConnections);
        }

        secondConnections = secondConnections.filter(connection => !invalidItems.includes(connection));
        invalidItems = invalidItems.concat(secondConnections);

        thirdConnections = [];
        for(let i = 0; i < secondConnections.length; i++) {
            let id = secondConnections[i];
            let currUser = await userModel.findById(id);
          
            thirdConnections = _.union(thirdConnections, currUser.firstConnections);
        }

        thirdConnections = thirdConnections.filter(connection => !invalidItems.includes(connection));

        updateHealthStatuses(firstConnections, 1);
        updateHealthStatuses(secondConnections, 2);
        updateHealthStatuses(thirdConnections, 3);

        res.json(user)

    } catch (err){
        res.writeHead(412);
        res.write(err.toString());
        res.send();
    }
})


router.get('/pollHealthStatus', async (req, res) => {
    if(!req.query.id){
        res.writeHead(412, {'Content-Type' : 'text-plain'});
        res.write('Failed: Missing Fields or invalid');
        res.send();
        return;
    }
    try {
        let user = (await userModel.find({_id: req.query.id}))[0]; 

        let changed = user.healthStatus != user.healthStatusOnLastCheck;
        let healthStatus = user.healthStatus;

        user.healthStatusOnLastCheck = user.healthStatus;
        
        user.save();

        let statusUpdate = {changed, healthStatus};

        res.json(statusUpdate);
    } catch (err) {
        res.writeHead(412);
        res.write(err.toString());
        res.send();
    } 
});

async function updateHealthStatuses(connections, level){
    for(let i = 0; i < connections.length; i++){
        let id = connections[i];
        let currUser = await userModel.findById(id);
        if(level < currUser.healthStatus){
            currUser.healthStatus = level;
            currUser.save();
        }
    }
}

module.exports = router;