
class MessageController {

    // [GET] /message
    displayMessageBox(req, res) {
        res.render('messagebox')
    }
}

module.exports = new MessageController;