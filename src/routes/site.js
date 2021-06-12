const router = require('express').Router();
const siteController = require('../controllers/SiteController');

router.get('/', siteController.displayHomePage);

module.exports = router;