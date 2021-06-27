class Account {
    static ROLE_CONSTANT = {
        ADMIN: true,
        NORMAL_USER: false
    }
    
    static getInstance({username, password, userrole}) {
        return {
            username,
            password,
            role: userrole
        }
    }
}

module.exports = Account;