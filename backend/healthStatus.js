const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const userModel = require('./userSchema');

const networkManager = require('./utils/networkManager.js');

const mongourl = require('./const.js').url;
mongoose.connect(mongourl);

router.post('/updateHealthStatus', async (req, res) => {
    if(!req.body.id || req.body.healthStatus == undefined){
        res.writeHead(412, {'Content-Type' : 'text-plain'});
        res.write('Failed: Missing Fields or invalid');
        res.send();
        return;
    }

    let newHealthStatus = req.body.healthStatus ? 0 : 4;

    try{
        let user = (await userModel.find({_id : req.body.id}))[0];
        
        user.healthStatus = newHealthStatus;
        user.healthStatus = newHealthStatus;
        user.save();

        if(newHealthStatus == 4){
            res.json(user);
            return;
        }
        
        let connections = await networkManager.findAllConnections(user);
        await updateHealthStatuses(connections.firstConnections, 1);
        await updateHealthStatuses(connections.secondConnections, 2);
        await updateHealthStatuses(connections.thirdConnections, 3);
       
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



module.exports = router;