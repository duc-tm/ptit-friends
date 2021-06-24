const messageBoxModel = require('../models/MessageBoxModel');

class MessageBoxController {

    // [GET] /message-box
    async displayMessageBoxList(req, res) {
        const userId = req.session.user.userId;

        try {
            const userMessageBoxes = await messageBoxModel.getUserMessageBoxes(userId);

            res.render('messagebox', {
                renderHeaderPartial: true,
                user: req.session.user,
                userMessageBoxes
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
            const allMessage = await messageBoxModel.getAllMessage(messageBoxId);
            res.status(200).json({ state: true, messageInfoList: allMessage });
        } catch (error) {
            console.log(error);
            res.status(503).json({ state: false });
        }
    }
}

module.exports = new MessageBoxController;