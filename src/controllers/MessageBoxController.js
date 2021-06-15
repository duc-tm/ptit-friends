const db = require('../utils/db');
const queryStrings = require('../utils/db/queryString');

class MessageBoxController {

    // [GET] /message-box
    async displayMessageBoxList(req, res) {
        const userId = req.session.user.userId;

        try {
            const results = await Promise.all([
                db.query(queryStrings.read.messageBoxList, [userId]),
                db.query(queryStrings.read.connectionList, [userId])
            ]);

            const rowsList = results.reduce((rowsList, result) => {
                rowsList.push(result.rows);
                return rowsList;
            }, []);

            const targetIdList = rowsList[0].map((row) => {
                return userId === row.user1id ? row.user2id : row.user1id;
            });

            const result = await db.query(
                db.genQueryIn(targetIdList.length, queryStrings.read.userList),
                targetIdList
            );

            const targetList = result.rows;

            const messageBoxList = rowsList[0].map((row, index) => {
                const row1 = rowsList[1][index];
                return {
                    messageBoxId: row.messageboxid,
                    target: targetList[index],
                    connectionState: row1.connectionstate,
                    connectionType: row1.connectiontype
                }
            })

            res.render('messagebox', { renderHeaderPartial: true, messageBoxList });
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