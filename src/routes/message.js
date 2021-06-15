const router = require('express').Router();
const messageController = require('../controllers/MessageController');

router.post('/:id/save', messageController.saveMessage);

module.exports = router;