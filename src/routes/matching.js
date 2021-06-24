const router = require('express').Router();

const userMiddleware = require('../middlewares/user');

const matchingController = require('../controllers/MatchingController');

router.post('/rec', userMiddleware.isLogedIn, matchingController.recommandMatching);

module.exports = router;