const { Pool } = require('pg');
const pool = new Pool({
    max: 10
});

module.exports = {
    query: (queryString, params, callback) => {
        const start = Date.now();
        return pool.query(queryString, params, (error, res) => {
            const duration = Date.now() - start;
            console.log('executed query', { queryString, duration, rows: res.rowCount });
            callback(error, res);
        });
    },

}