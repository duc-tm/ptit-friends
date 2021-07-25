const connectionModel = require('../models/ConnectionModel');
const friendRequestModel = require('../models/FriendRequestModel');
const userModel = require('../models/UserModel');
const { calMatchingPoint, getTargetId } = require('../helpers/userHelper');

class Matching {
    static async recommandMatching(userId, { preferHobbies, preferGender, preferAge, preferMajors }) {

        const targetList = await userModel.getRandomUsers(20, preferGender, [userId]);
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
        console.log(sortedTargetList)
        return { recTargetList: sortedTargetList.slice(0, 10) };
    }
}

module.exports = Matching;