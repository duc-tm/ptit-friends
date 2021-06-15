module.exports = {
    read: {
        byUserName: 'SELECT*FROM users WHERE username = $1',
        byId: 'SELECT*FROM users WHERE userId = $1',
        messageBoxList: 'SELECT*FROM messageboxes WHERE user1Id = $1 OR user2Id = $1',
        connectionList: 'SELECT*FROM chatconnections WHERE user1Id = $1 OR user2Id = $1',
        userList: 'SELECT userid, fname FROM users WHERE userid IN',
        messageList: 'SELECT messageid, userid, messagecontent, createdat FROM messages WHERE messageboxid = $1'
    },
    create: {
        user: 'INSERT INTO users(username, password, email) VALUES($1, $2, $3)',
        message: 'INSERT INTO messages(messageBoxId, userId, messageContent) VALUES($1, $2, $3)'
    }
}