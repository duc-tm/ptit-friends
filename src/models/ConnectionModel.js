class Connection {
    constructor({ user1id, user2id, connectionstate, connectiontype }) {
        this.user1Id = user1id;
        this.user2Id = user2id;
        this.connectionState = connectionstate;
        this.connectionType = connectiontype;
    }
}

module.exports = Connection;