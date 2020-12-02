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

    /* String must be either 'true' or 'false' */
    if(req.body.healthStatus.toString() != 'true' 
        && req.body.healthStatus.toString() != 'false'){
        res.writeHead(412, {'Content-Type' : 'text-plain'});
        res.write('Failed: Missing Fields or invalid');
        res.send();
        return;
    }

    /* Get the corresponding risk level */
    let newHealthStatus = (req.body.healthStatus.toString() == "true") ? hsConst.riskLevel.immediate : hsConst.riskLevel.none;

    try{
        let user = (await userModel.find({_id : req.body.id}))[0];
        
        if(!user){
            let err = new Error('User not found');
            throw err;
        }

        /* Changing the user to not sick has no effect if the healthStatus is not already sick */
        if(newHealthStatus == hsConst.riskLevel.none && user.healthStatus > hsConst.riskLevel.immediate){
            newHealthStatus = user.healthStatus;
        } else if(newHealthStatus == hsConst.riskLevel.none && user.healthStatus == hsConst.riskLevel.immediate){
            /* If sick and going to not sick find the lowest level in your connections and increment by 1 */
            newHealthStatus = await networkManager.findLowestConnectedHealthStatus(user.firstConnections) + hsConst.connectivityLevel.first;
            newHealthStatus = Math.min(4, newHealthStatus);
        }

        user.healthStatus = newHealthStatus;
        user.healthStatusOnLastCheck = newHealthStatus;
        user.save();

        /* Does not update healthStatuses of connection is user is not sick */
        if(newHealthStatus != hsConst.riskLevel.immediate){
            res.json(user);
            return;
        }
        
        /* Update the healthStatuses of all connections */
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
        /* Check if the user's health status has changed since last poll*/
        let changed = user.healthStatus != user.healthStatusOnLastCheck;
        let healthStatus = user.healthStatus;

        user.healthStatusOnLastCheck = user.healthStatus;
        
        user.save();

        /* Send a status update including the healthStatus and if its changed */
        let statusUpdate = {changed, healthStatus};

        res.json(statusUpdate);
    } catch (err) {
        res.writeHead(412);
        res.write(err.toString());
        res.send();
    } 
});

module.exports = router;