const db = require('../utils/db');
const queryStrings = require('../utils/db/queryString');
const { mapRows } = require('../utils/db/rowMapper');
const userModel = require('../models/UserModel');
const messageBoxModel = require('../models/MessageBoxModel');
const connectionModel = require('../models/ConnectionModel');

class MessageBoxController {

    // [GET] /message-box
    async displayMessageBoxList(req, res) {
        const userId = req.session.user.userId;
        const result = await db.query(queryStrings.read.byId, [userId]);
        const user = new userModel(result.rows[0]);

        try {
            const results = await Promise.all([
                db.query(queryStrings.read.messageBoxList, [userId]),
                db.query(queryStrings.read.connectionList, [userId])
            ]);

            const messageBoxList = mapRows(results[0].rows, results[0].rowCount, messageBoxModel);
            const connectionList = mapRows(results[1].rows, results[1].rowCount, connectionModel);

            let chatBoxList = [];

            if (connectionList.length > 0) {
                const targetIdList = connectionList.map((connection) => {
                    return userId === connection.user1Id ? connection.user2Id : connection.user1Id;
                });

                const result = await db.query(
                    db.genQueryIn(targetIdList.length, queryStrings.read.userList, false, 'userid'),
                    targetIdList
                );

                const targetList = result.rows;

                chatBoxList = await Promise.all(messageBoxList.map(async (messageBox, index) => {
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
                }));
            }

            res.render('messagebox', {
                renderHeaderPartial: true,
                user,
                chatBoxList: chatBoxList
            });
        } catch (error) {
            console.log(error);
            res.status(503).json({ state: false });
        }
    }

    // [GET] /message-box/:id
    async displayBoxChat(req, res) {
        const messageBoxId = req.params.id;

        try {
            const result = await db.query(queryStrings.read.messageList, [messageBoxId]);
            res.status(200).json({ state: true, messageInfoList: result.rows });
        } catch (error) {
            console.log(error);
            res.status(503).json({ state: false });
        }
    }
}

module.exports = new MessageBoxController;