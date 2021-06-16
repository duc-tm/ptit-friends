const router = require('express').Router();
const siteController = require('../controllers/SiteController');
const userMiddleware = require('../middlewares/user');

router.get('/', userMiddleware.isLogedIn, siteController.displayHomePage);
router.get('/welcome', siteController.displayWelcomePage);

module.exports = router;