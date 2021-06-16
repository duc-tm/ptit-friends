const router = require('express').Router();
const userController = require('../controllers/UserController');
const userMiddleware = require('../middlewares/user');
const validateMiddleware = require('../middlewares/validateMiddleware');

router.post('/register',
    validateMiddleware.registerInputValidate,
    userController.register
);
router.post('/login', userController.login);
router.post('/logout', userMiddleware.isLogedIn, userController.logout);
router.post('/matching', userMiddleware.isLogedIn, userController.matching);
router.get('/get-info/:id', userMiddleware.isLogedIn, userController.getUserInfo);
router.post('/send-friend-request', userMiddleware.isLogedIn, userController.sendFriendRequest);
router.get('/friend-request', userMiddleware.isLogedIn, userController.getFriendRequest);

module.exports = router;