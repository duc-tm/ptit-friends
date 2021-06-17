const router = require('express').Router();
const messageBoxController = require('../controllers/MessageBoxController');
const userMiddlware = require('../middlewares/user');

router.get('/:id', userMiddlware.isLogedIn, messageBoxController.displayBoxChat);
router.get('/', userMiddlware.isLogedIn, messageBoxController.displayMessageBoxList);

module.exports = router;