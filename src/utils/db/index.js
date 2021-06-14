const { Pool } = require('pg');
const pool = new Pool({
    max: 10
});

module.exports = {
    query: async (queryString, params) => {
        const start = Date.now();
        try {
            const result = await pool.query(queryString, params);
            const duration = Date.now() - start;
            console.log('executed query', { queryString, duration, rows: result.rowCount });
            return result;
        } catch (error) {
            throw error;
        }
    },
    getClient: (callback) => {
        pool.connect((error, client, done) => {
            callback(error, client, done);
        });
    },
}