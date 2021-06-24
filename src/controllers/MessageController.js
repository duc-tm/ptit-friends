const messageModel = require('../models/MessageModel');

class MessageController {

    // [POST] /message/:id/save
    async saveMessage(req, res) {
        const messageBoxId = req.params.id;
        const messageContent = req.body.message;

        try {
            await messageModel.saveMessage(messageBoxId, messageContent, req.session.user.userId);
            res.status(201).json({ state: true });
        } catch (error) {
            console.log(error);
            res.status(503).json({ state: false });
        }
    }
}

module.exports = new MessageController;