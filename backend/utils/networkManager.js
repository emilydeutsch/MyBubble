const _ = require('lodash');
const mongoose = require('mongoose');

const userModel = require('./../userSchema');

const mongourl = require('./../const.js').url;
mongoose.connect(mongourl);

findAllConnections = async (user) => {
    console.log(user);

    try {
        console.log(mongourl);
        let firstConnections = user.firstConnections;

        let secondConnections = [];
        let invalidItems = [];

        invalidItems.push(user._id.toString());
        invalidItems = invalidItems.concat(firstConnections);

        for(let i = 0; i < firstConnections.length; i++) {
            let id = firstConnections[i];
            console.log("fc promise start");
            let currUser = await userModel.findById(id);
            console.log("fc promise end");

            secondConnections = _.union(secondConnections, currUser.firstConnections);
            
        }

        secondConnections = secondConnections.filter(connection => !invalidItems.includes(connection));
        console.log(secondConnections);
        invalidItems = invalidItems.concat(secondConnections);

        let thirdConnections = [];
        for(let i = 0; i < secondConnections.length; i++) {
            let id = secondConnections[i];
            console.log("sc promise start");
            let currUser = await userModel.findById(id);
            console.log("sc promise end");

            thirdConnections = _.union(thirdConnections, currUser.firstConnections);
        }

        thirdConnections = thirdConnections.filter(connection => !invalidItems.includes(connection));
        console.log(thirdConnections);

        return {firstConnections, secondConnections, thirdConnections};
    } catch (err) {
        throw err;
    }
}

updateHealthStatuses = async (connections, level) =>{
    try {
        let count = 0;

        for(let i = 0; i < connections.length; i++){
            let id = connections[i];
            let currUser = await userModel.findById(id);
            
            if(level < currUser.healthStatus){
                currUser.healthStatus = level;
                currUser.save();
                count++;
            }
        }
        return count;
    } catch (err) {
        throw err;
    }   
}

module.exports = {findAllConnections, updateHealthStatuses};