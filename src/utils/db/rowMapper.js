module.exports = {
    mapRows(rows, rowCount, model) {
        return rowCount ? rows.map((row) => model.getInstance(row)) : [];
    }
}