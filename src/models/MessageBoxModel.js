const db = require('../utils/db');
const queryStrings = require('../utils/db/queryString');
const { mapRows } = require('../utils/db/rowMapper');

const connectionModel = require('../models/ConnectionModel');
const messageModel = require('../models/MessageModel');
const userModel = require('../models/UserModel');

const { getTargetId } = require('../helpers/userHelper');

class MessageBox {
    static getInstance({ messageboxid, user1id, user2id }) {
        return {
            messageBoxId: messageboxid,
            user1Id: user1id,
            user2Id: user2id
        }
    }

    static async getUserMessageBoxes(userId) {
        const results = await Promise.all([
            this.getMessageBoxList(userId),
            connectionModel.getUserConnections(userId)
        ]);

        const messageBoxList = results[0];
        const connectionList = results[1];

        if (connectionList.length <= 0) return [];

        const targetIdList = connectionList.map((connection) => {
            return getTargetId(userId, connection);
        });

        const targetList = await userModel.getUserByIds(targetIdList);

        const userMessageBoxes = messageBoxList.map((messageBox, index) => {
            // const result = await db.query(
            //     queryStrings.read.messageList + 'ORDER BY messageid DESC LIMIT 1',
            //     [messageBoxId]
            // );

            const connection = connectionList[index];
            return {
                messageBoxId: messageBox.messageBoxId,
                target: targetList[index],
                // lastMessage: (result.rows[0] ? result.rows[0].messagecontent : ''),
                connectionState: connection.connectionState,
                connectionType: connection.connectionType
            }
        });

        return userMessageBoxes;
    }

    static async getMessageBoxList(userId) {
        const result = await db.query(queryStrings.read.messageBoxList, [userId]);
        return mapRows(result.rows, result.rowCount, this);
    }

    static async getAllMessage(messageBoxId) {
        const result = await db.query(queryStrings.read.messageList, [messageBoxId]);
        return mapRows(result.rows, result.rowCount, messageModel);
    }
}

module.exports = MessageBox;