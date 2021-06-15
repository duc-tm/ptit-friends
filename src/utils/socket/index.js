// const {  } = require('./SocketEventHandler');

module.exports = function socketListener(socketServer) {
    const userSocketIds = new Map();
    socketServer.on('connection', (socket) => {
        console.log(`connect ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`disconnect ${socket.id}`);
        });

        socket.on('set-connect-info', (userId) => {
            userSocketIds.set(userId, socket.id);
            console.log(`set ${userId} with ${socket.id}`);
        });

        socket.on('client-send-message', ({ message, targetId }) => {
            socket.to(userSocketIds.get(targetId)).emit('server-send-message', message);
        });

    });

}