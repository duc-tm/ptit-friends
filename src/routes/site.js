const router = require('express').Router();
const siteController = require('../controllers/SiteController');

router.get('/welcome', siteController.displayWelcomePage);
router.get('/', siteController.displayHomePage);

module.exports = router;