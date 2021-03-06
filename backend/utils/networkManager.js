const _ = require('lodash');
const mongoose = require('mongoose');

const userModel = require('./../userSchema');
const hsConst = require('./healthStatusConst.js');

const mongourl = require('./../const.js').url;
mongoose.connect(mongourl);

findAllConnections = async (user) => {
    try {
        let firstConnections = user.firstConnections;

        let secondConnections = [];
        let invalidItems = [];

        /* Invalid items has id's that have already been collected
         * so we do not double count any users
         */
        invalidItems.push(user._id.toString());
        invalidItems = invalidItems.concat(firstConnections);

        /* For each level for every user we get their connections then 
         * filter with the invalid items
         */
        for(let i = 0; i < firstConnections.length; i++) {
            let id = firstConnections[i];
            let currUser = await userModel.findById(id);

            secondConnections = _.union(secondConnections, currUser.firstConnections);
        }

        secondConnections = secondConnections.filter(connection => !invalidItems.includes(connection));
        invalidItems = invalidItems.concat(secondConnections);

        /* Repeat for third level */
        let thirdConnections = [];
        for(let i = 0; i < secondConnections.length; i++) {
            let id = secondConnections[i];
           
            let currUser = await userModel.findById(id);
            thirdConnections = _.union(thirdConnections, currUser.firstConnections);
        }

        thirdConnections = thirdConnections.filter(connection => !invalidItems.includes(connection));

        return {firstConnections, secondConnections, thirdConnections};
    } catch (err) {
        throw err;
    }
}

findSecondConnections = async (user) => {
    try {
        let firstConnections = user.firstConnections;

        let secondConnections = [];
        let invalidItems = [];

        invalidItems.push(user._id.toString());
        invalidItems = invalidItems.concat(firstConnections);

        /* For every user we get their connections then 
         * filter with the ids that are already contained
         * in the firstConnections to avoid double counting 
         */
        for(let i = 0; i < firstConnections.length; i++) {
            let id = firstConnections[i];
            let currUser = await userModel.findById(id);

            secondConnections = _.union(secondConnections, currUser.firstConnections);
        }

        secondConnections = secondConnections.filter(connection => !invalidItems.includes(connection));

        return secondConnections;
    } catch (err) {
        throw err;
    }
}

updateHealthStatuses = async (connections, level) =>{
    try {
        let count = 0;

        /* Goes through all the connections and if the new
         * healthStatus is lower then their current it is
         * changed
         */
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

findLowestConnectedHealthStatus = async (connections) => {
    try {
        let lowestConnected = hsConst.riskLevel.none;
        /* Go over all healthStatuses and find the lowest */
        for(let i = 0; i < connections.length; i++){
            let id = connections[i];
            let currUser = await userModel.findById(id);
            
            if(currUser.healthStatus < lowestConnected){
                lowestConnected = currUser.healthStatus;
                if(lowestConnected == hsConst.riskLevel.immediate){
                    break;
                }
            }
        }
        return lowestConnected;
    } catch (err) {
        throw err;
    }   
}

module.exports = {findAllConnections, updateHealthStatuses, findLowestConnectedHealthStatus, findSecondConnections};