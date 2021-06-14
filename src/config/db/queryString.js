module.exports = {
    read: {
        byUserName: 'SELECT*FROM users WHERE username = $1',
        byId: 'SELECT*FROM users WHERE userId = $1',
    },
    create: {
        user: 'INSERT INTO users(username, password, email) VALUES($1, $2, $3)'
    }
}