const db = require('../utils/db');
const queryStrings = require('../utils/db/queryString');
const { mapRows } = require('../utils/db/rowMapper');

class Connection {
    static getInstance({ user1id, user2id, connectionstate, connectiontype }) {
        return {
            user1Id: user1id,
            user2Id: user2id,
            connectionState: connectionstate,
            connectionType: connectiontype
        }
    }

    static async getUserConnections(userId) {
        const result = await db.query(queryStrings.read.connectionList, [userId]);
        return mapRows(result.rows, result.rowCount, this);
    }
}

module.exports = Connection;