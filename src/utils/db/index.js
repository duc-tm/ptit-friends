const { Pool } = require('pg');
const queryString = require('./queryString');
const pool = new Pool({
    max: 10
});

module.exports = {
    pool,
    query: async (queryString, params) => {
        const start = Date.now();
        try {
            const result = await pool.query(queryString, params);
            const duration = Date.now() - start;
            console.log('Executed query', { queryString, duration, rows: result.rowCount });
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
    genQueryIn: (paramsLength, queryString, startIndex = 0) => {
        queryString += '(';
        let i = 1;
        for(i; i < paramsLength; i++) {
            queryString += `$${i + startIndex}, `;
        }
        queryString += `$${i + startIndex})`
        return queryString;
    },
    genInsertMultiple: (paramsLength, queryString) => {
        
    }
}