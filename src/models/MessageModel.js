const db = require('../utils/db');
const queryStrings = require('../utils/db/queryString');

class Message {
    static getInstance({ messageid, userid, messagecontent, createdat }) {
        return {
            messageId: messageid,
            userId: userid,
            messageContent: messagecontent,
            createdAt: createdat
        }
    }

    static async saveMessage(messageBoxId, messageContent, senderId) {
        try {
            await db.query(queryStrings.create.message,
                [
                    messageBoxId,
                    senderId,
                    messageContent
                ]
            );
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Message;