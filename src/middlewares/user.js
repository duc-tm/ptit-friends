module.exports = {
    isLogedIn: (req, res, next) => {
        if(req.session.user) {
            return next();
        }
        res.render('welcome');
    }
}