const router = require('express').Router();
const messageController = require('../controllers/MessageController');
const userMiddlware = require('../middlewares/user');

router.post('/:id/save', userMiddlware.isLogedIn, messageController.saveMessage);

module.exports = router;