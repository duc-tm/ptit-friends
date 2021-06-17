const db = require('../utils/db');
const queryStrings = require('../utils/db/queryString');
const userModel = require('../models/UserModel');

class SiteController {

    // [GET] /
    async displayHomePage(req, res) {
        const result = await Promise.all([
            db.query(queryStrings.read.byId, [req.session.user.userId]),
            db.query(queryStrings.read.hobbyList, [])
        ]);

        const user = new userModel(result[0].rows[0]);
        const hobbyList = result[1].rows.map((hobby) => {
            return hobby.hobbytype;
        });

        res.render('home', { renderHeaderPartial: true, user, hobbyList })
    }

    // [GET] /welcome
    displayWelcomePage(req, res) {
        res.render('welcome', { renderHeaderPartial: false })
    }
}

module.exports = new SiteController