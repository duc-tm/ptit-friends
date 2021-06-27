const db = require('../utils/db');
const queryStrings = require('../utils/db/queryString');
const { mapRows } = require('../utils/db/rowMapper');

class FriendRequest {
    static getInstance({userid, senderid, requeststate}) {
        return {
            userId: userid,
            senderId: senderid,
            requestState: requeststate
        }
    }

    static async createFriendRequest(senderId, receiverId) {
        try {
            await db.query(queryStrings.create.friendRequest, [receiverId, senderId, false]);
            return true;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async changeState(state, userId, senderId) {
        try {
            await db.query(queryStrings.update.friendRequestState, [state, userId, senderId])
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async getUserSentRequest(userId) {
        const result = await db.query(queryStrings.read.sentFriendRequest, [userId]);
        return mapRows(result.rows, result.rowCount, this);
    }
}

module.exports = FriendRequest;