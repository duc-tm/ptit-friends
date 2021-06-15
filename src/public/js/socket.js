const socket = io('http://localhost:3000');
const userId = getCookies()['userId'];

socket.on('connect', () => {
    socket.emit('set-connect-info', userId);

    socket.on('active', () => {

    });

    socket.on('inactive', () => {

    });
});
