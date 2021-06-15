module.exports = {
    isLogedIn: (req, res, next) => {
        const user = req.session.user;
        if (user) {
            if (user.userId) return next();
        }
        res.render('welcome', { renderHeaderPartial: false });
    }
}