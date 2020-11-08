const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const userModel = require('./userSchema');

const networkManager = require('./utils/networkManager.js');
const mongourl = require('./const.js').url;
const hsConst = require('./utils/healthStatusConst.js');
const { riskLevel } = require('./utils/healthStatusConst.js');
mongoose.connect(mongourl);

router.post('/updateHealthStatus', async (req, res) => {
    if(!req.body.id || req.body.healthStatus == undefined){
        res.writeHead(412, {'Content-Type' : 'text-plain'});
        res.write('Failed: Missing Fields or invalid');
        res.send();
        return;
    }

    let newHealthStatus = (req.body.healthStatus == "true") ? hsConst.riskLevel.immediate : hsConst.riskLevel.none;

    try{
        let user = (await userModel.find({_id : req.body.id}))[0];
        
        if(!user){
            let err = new Error('User not found');
            throw err;
        }

        if(newHealthStatus == hsConst.riskLevel.none && user.healthStatus > hsConst.riskLevel.immediate){
            newHealthStatus = user.healthStatus;
        } else if(newHealthStatus == hsConst.riskLevel.none && user.healthStatus == hsConst.riskLevel.immediate){
            newHealthStatus = networkManager.findLowestConnectedHealthStatus(user.firstConnections) + hsConst.connectivityLevel.first;
        }

        user.healthStatus = newHealthStatus;
        user.healthStatusOnLastCheck = newHealthStatus;
        user.save();

        if(newHealthStatus != hsConst.riskLevel.immediate){
            res.json(user);
            return;
        }
        
        let connections = await networkManager.findAllConnections(user);
        await networkManager.updateHealthStatuses(connections.firstConnections, hsConst.riskLevel.major);
        await networkManager.updateHealthStatuses(connections.secondConnections, hsConst.riskLevel.moderate);
        await networkManager.updateHealthStatuses(connections.thirdConnections, hsConst.riskLevel.minor);
       
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

        if(!user){
            let err = new Error('User not found');
            throw err;
        }

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

module.exports = router;