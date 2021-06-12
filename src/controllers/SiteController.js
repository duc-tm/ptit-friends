
class SiteController {

    // [GET] /
    displayHomePage(req, res) {
        res.send('Home page')
    }
}

module.exports = new SiteController