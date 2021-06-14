const db = require('../config/db');
const queryString = require('../config/db/queryString');
const userModel = require('../models/UserModel');

class UserController {
    async register(req, res) {
        const { username, password, email } = req.body;

        try {
            const result = await db.query(`${queryString.read.byUserName} OR email = $2`, [username, email]);

            if (result.rowCount > 0) {
                if (username === result.rows[0].username)
                    return res.json({ username: 'Username is already exist' });
                if (email === result.rows[0].email)
                    return res.json({ email: 'Email is already exist' });
            }

            await db.query(queryString.create.user, [username, password, email]);

            res.status(201).json({ msg: 'Register successful!' });
        } catch (error) {
            console.log(error);
            return res.status(503).json({ msg: 'Server got some error. Please try again later.' });
        }
    }

    async login(req, res) {
        const { username, password } = req.body;

        try {
            const result = await db.query(queryString.read.byUserName, [username]);

            if (result.rowCount > 0) {
                const { password: userPassword } = result.rows[0];
                if (password === userPassword) {
                    const user = new userModel(result.rows[0]);
                    return res.status(200).render('messagebox', user);
                }
            }

            res.json({ msg: 'Incorrect username or password!' });
        } catch (error) {
            console.log(error);
            return res.status(503).json({ msg: 'Server got some error. Please try again later.' });
        }
    }
}

module.exports = new UserController;