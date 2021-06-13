require('dotenv').config();
const path = require('path');
const express = require('express')
const app = express();
const httpServer = require('http').createServer(app);
const ioServer = require('socket.io')(httpServer);
const morgan = require('morgan')
const ehbs = require('express-handlebars');
const route = require('./routes');
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(morgan('combined'));

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

ioServer.on('connection', (socket) => {
    console.log(`connect ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`disconnect ${socket.id}`);
    });
    socket.on('client-message', (message) => {
    })
});

httpServer.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
});