const router = require('express').Router();
const messageBoxController = require('../controllers/MessageBoxController');

router.get('/:id', messageBoxController.displayBoxChat);
router.get('/', messageBoxController.displayMessageBoxList);

module.exports = router;