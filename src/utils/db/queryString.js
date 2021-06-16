module.exports = {
    read: {
        byUserName: 'SELECT*FROM users WHERE username = $1',
        byId: 'SELECT*FROM users WHERE userId = $1',
        messageBoxList: 'SELECT*FROM messageboxes WHERE user1Id = $1 OR user2Id = $1',
        connectionList: 'SELECT*FROM chatconnections WHERE user1Id = $1 OR user2Id = $1',
        userList: 'SELECT userid, fname FROM users WHERE userid IN',
        messageList: 'SELECT messageid, userid, messagecontent, createdat FROM messages WHERE messageboxid = $1',
        randomUserList: 'SELECT*FROM users WHERE userid != $1 AND gender = $2 ORDER BY RANDOM() LIMIT 20',
        userHobbies: 'SELECT users.userid, hobbies.hobbytype FROM users, usershobby, hobbies ' 
            + 'WHERE users.userid = usershobby.userid '
            + 'AND usershobby.hobbyid = hobbies.hobbyid '
            + 'AND users.userid IN',
        hobbyList: 'SELECT hobbytype FROM hobbies',
        friendRequestList: 'SELECT users.* FROM friendrequests, users WHERE friendrequests.senderid = users.userid '
            + 'AND friendrequests.requeststate = false '
            + 'AND friendrequests.userid = $1'
    },
    create: {
        user: 'INSERT INTO users(username, password, email) VALUES($1, $2, $3)',
        message: 'INSERT INTO messages(messageBoxId, userId, messageContent) VALUES($1, $2, $3)',
        friendRequest: 'INSERT INTO friendrequests(userid, senderid, requeststate) VALUES($1, $2, $3)'
    },
    update: {
        friendRequestState: 'UPDATE friendrequests SET requeststate = $1 WHERE userid = $2'
    }
}