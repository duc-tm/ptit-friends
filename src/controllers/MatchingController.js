const matchingModel = require('../models/MatchingModel');

class MatchingController {

    // [POST] /matching/rec
    async recommandMatching(req, res) {
        try {
            const userId = req.session.user.userId;

            const result = await matchingModel.recommandMatching(userId, req.body);

            res.status(200).json(result.recTargetList);
        } catch (error) {
            console.log(error);
            res.status(503).json({ msg: 'Server got some error. Please try again later.' });
        }
    }
}

module.exports = new MatchingController;