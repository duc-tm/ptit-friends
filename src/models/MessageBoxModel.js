const db = require('../utils/db');
const queryStrings = require('../utils/db/queryString');
const { mapRows } = require('../utils/db/rowMapper');

const connectionModel = require('./ConnectionModel');
const messageModel = require('./MessageModel');

const { getTargetId } = require('../helpers/userHelper');

class MessageBox {
    static getInstance({ messageboxid, user1id, user2id }) {
        return {
            messageBoxId: messageboxid,
            user1Id: user1id,
            user2Id: user2id
        }
    }

    static async createMessageBox(userId, senderId) {
        try {
            await db.query(queryStrings.create.messageBox, [userId, senderId]);
            return true;
        } catch (error) {
            throw error
        }
        
    }

    static async getUserMessageBoxes(userId, userModel) {
        const results = await Promise.all([
            this.getMessageBoxList(userId),
            connectionModel.getUserConnections(userId)
        ]);

        const messageBoxList = results[0];
        if (messageBoxList.length <= 0) return [];

        const messageBoxMap = messageBoxList.reduce((total, messageBox) => {
            return total.set(getTargetId(userId, messageBox), messageBox);
        }, new Map());

        const connectionMap = results[1].reduce((total, connection) => {
            return total.set(getTargetId(userId, connection), connection);
        }, new Map());

        const targetMap = (await userModel.getUserByIds([...connectionMap.keys()]))
            .reduce((total, user) => total.set(user.userId, user), new Map());

        const userMessageBoxes = [];

        messageBoxMap.forEach((messageBox, targetId) => {
            // const result = await db.query(
            //     queryStrings.read.messageList + 'ORDER BY messageid DESC LIMIT 1',
            //     [messageBoxId]
            // );
            const connection = connectionMap.get(targetId);
            userMessageBoxes.push({
                messageBoxId: messageBox.messageBoxId,
                target: targetMap.get(targetId),
                // lastMessage: (result.rows[0] ? result.rows[0].messagecontent : ''),
                connectionState: connection.connectionState,
                connectionType: connection.connectionType
            });
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