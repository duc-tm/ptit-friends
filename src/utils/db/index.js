const { Pool } = require('pg');
const queryString = require('./queryString');
const pool = new Pool({
    max: 10
});
const types = require('pg').types;
const timestampOID = 1114;
types.setTypeParser(timestampOID, function(stringValue) {
  return stringValue;
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
    /* 
    *PARAMS
        paramsLength - number of param pass to IN clause
        queryString - base query string to generate IN query
        notIn - generate IN or NOT IN query. True - NOT IN, False - IN
        fieldName - column name of database table in WHERE clause,
        startIndex - start index of IN clause. Default to 0
    *RETURN
        query string with IN clause
    */
    genQueryIn: (paramsLength, queryString, connectClause, notIn, fieldName, startIndex = 0) => {
        if(paramsLength <= 0) return queryString;
        queryString += ` ${connectClause} ${fieldName} ${notIn ? 'NOT IN(' : 'IN('}`;
        let i = 1;
        for (i; i < paramsLength; i++) {
            queryString += `$${i + startIndex}, `;
        }
        queryString += `$${i + startIndex})`
        return queryString;
    },
    genInsertMultiple: (paramsLength, queryString) => {

    },
    genQueryRandom: (numberOfRows, queryString) => {
        return `${queryString} ORDER BY RANDOM() LIMIT ${numberOfRows}`;
    }
}