const db = require('../utils/db');
const queryStrings = require('../utils/db/queryString');

class MessageController {

    // [POST] /message/:id/save
    async saveMessage(req, res) {
        const messageBoxId = req.params.id;
        const messageContent = req.body.message;

        try {
            await db.query(queryStrings.create.message,
                [
                    messageBoxId,
                    req.cookies.userId,
                    messageContent
                ]
            );
            res.status(201).json({ state: true });
        } catch (error) {
            console.log(error);
            res.status(503).json({ state: false });
        }
    }
}

module.exports = new MessageController;