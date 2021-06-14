const siteRouter = require('./site');
const messageRouter = require('./message');
const userRouter = require('./user');

function router(app) {
    app.use('/user', userRouter);
    app.use('/message', messageRouter)
    app.use('/', siteRouter)
}

module.exports = router;