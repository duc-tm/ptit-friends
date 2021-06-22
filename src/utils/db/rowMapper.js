module.exports = {
    mapRows(rows, rowCount, model) {
        return rowCount ? rows.map((row) => new model(row)) : [];
    }
}