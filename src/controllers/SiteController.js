
class SiteController {

    // [GET] /
    displayHomePage(req, res) {
        res.render('home')
    }
}

module.exports = new SiteController