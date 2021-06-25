const connectionModel = require('../models/ConnectionModel');
const friendRequestModel = require('../models/FriendRequestModel');
const userModel = require('../models/UserModel');
const { calMatchingPoint, getTargetId } = require('../helpers/userHelper');

class Matching {
    static async recommandMatching(userId, { preferHobbies, preferGender, preferAge, preferMajors }) {
        const [sentRequests, userConnections] = await Promise.all([
            friendRequestModel.getUserSentRequest(userId),
            connectionModel.getUserConnections(userId)
        ]);
        
        const exceptUserIds = sentRequests.reduce((total, sentRequest) => {
            return sentRequest.requestState ? total : total.set(sentRequest.userId, true);
        }, new Map());

        userConnections.reduce((total, userConnection) => {
            if (userConnection.connectionState) {
                const connectedTargetId = getTargetId(userId, userConnection);
                total.set(connectedTargetId, true);
            }
            return total;
        }, exceptUserIds);

        const targetList = await userModel.getRandomUsers(
            20, preferGender,
            [...exceptUserIds.keys(), userId]
        );
        const targetIdList = targetList.map((target) => target.userId);

        const targetHobbiesList = await userModel.getUsersHobbies(targetIdList);

        const targetHobbiesMap = targetHobbiesList.reduce((total, hobby) => {
            const userId = hobby.userId;
            if (!total[userId]) total[userId] = new Map();
            total[userId].set(hobby.hobbyType, true);
            return total;
        }, {});

        const preferMajorsMap = preferMajors.reduce((total, preferMajor) => total.set(preferMajor, true), new Map());
        const sortedTargetList = calMatchingPoint(
            targetList, targetHobbiesMap, preferHobbies, preferAge, preferMajorsMap
        );

        return { recTargetList: sortedTargetList.slice(0, 10) };
    }
}

module.exports = Matching;