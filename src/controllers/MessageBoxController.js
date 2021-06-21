const db = require('../utils/db');
const queryStrings = require('../utils/db/queryString');
const userModel = require('../models/UserModel');

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

            const rowsList = results.reduce((total, result) => {
                if (result.rows.length > 0)
                    total.push(result.rows);
                return total;
            }, []);

            let messageBoxList = [];

            if (rowsList.length > 0) {
                const targetIdList = rowsList[0].map((row) => {
                    return userId === row.user1id ? row.user2id : row.user1id;
                });

                const result = await db.query(
                    db.genQueryIn(targetIdList.length, queryStrings.read.userList),
                    targetIdList
                );

                const targetList = result.rows;

                messageBoxList = await Promise.all(rowsList[0].map(async (row, index) => {
                    const messageBoxId = row.messageboxid;
                    // const result = await db.query(
                    //     queryStrings.read.messageList + 'ORDER BY messageid DESC LIMIT 1',
                    //     [messageBoxId]
                    // );

                    const row1 = rowsList[1][index];
                    return {
                        messageBoxId: messageBoxId,
                        target: targetList[index],
                        // lastMessage: (result.rows[0] ? result.rows[0].messagecontent : ''),
                        connectionState: row1.connectionstate,
                        connectionType: row1.connectiontype
                    }
                }));
            }

            res.render('messagebox', {
                renderHeaderPartial: true,
                user,
                messageBoxList: messageBoxList
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