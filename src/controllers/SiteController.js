
class SiteController {

    // [GET] /
    displayHomePage(req, res) {
        res.render('home')
    }

    // [GET] /welcome
    displayWelcomePage(req, res) {
        res.render('welcome');
    }
}

module.exports = new SiteController