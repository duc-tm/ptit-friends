require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const ioServer = require('socket.io')(httpServer);
const socketListener = require('./utils/socket');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const ehbs = require('express-handlebars');
const route = require('./routes');
const PORT = process.env.PORT || 3000;
const db = require('./utils/db');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(morgan('combined'));

app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET || 'ptit-friends-secret',
    store: new (require('connect-pg-simple')(session))({
        pool: db.pool,
        tableName: 'session'
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: true,
        maxAge: 60 * 60 * 1000
    }
}));

app.engine('hbs', ehbs({
    extname: 'hbs',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
    },
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

route(app);

socketListener(ioServer);

httpServer.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
});