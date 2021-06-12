const router = require('express').Router();
const messageController = require('../controllers/MessageController');

router.get('/', messageController.displayMessageBox);

module.exports = router;