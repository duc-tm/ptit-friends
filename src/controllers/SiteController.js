const db = require('../utils/db');
const queryStrings = require('../utils/db/queryString');

class SiteController {

    // [GET] /
    async displayHomePage(req, res) {
        const result = await db.query(queryStrings.read.hobbyList, []);
        const hobbyList = result.rows.map((hobby) => {
            return hobby.hobbytype;
        });

        res.render('home', { renderHeaderPartial: true, hobbyList })
    }

    // [GET] /welcome
    displayWelcomePage(req, res) {
        res.render('welcome', { renderHeaderPartial: false })
    }
}

module.exports = new SiteController