const siteRouter = require('./site');
const messageRouter = require('./message');

function router(app) {
    app.use('/message', messageRouter)
    app.use('/', siteRouter)
}

module.exports = router;