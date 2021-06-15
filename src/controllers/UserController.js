const db = require('../utils/db');
const queryString = require('../utils/db/queryString');
const userModel = require('../models/UserModel');
const accountModel = require('../models/AccountModel');
const { hash, compareHash } = require('../utils/bcrypt');

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

            const hashedPassword = await hash(password);
            await db.query(queryString.create.user, [username, hashedPassword, email]);

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
                const account = new accountModel(result.rows[0]);
                const user = new userModel(result.rows[0]);
                const isMatch = await compareHash(password, account.password);

                if (isMatch) {
                    req.session.user = { userId: user.userId, fName: user.fName };
                    res.cookie('userId', user.userId)
                    return res.status(200).json({ redirectPath: '/' });
                }
            }

            res.status(401).json({ msg: 'Incorrect username or password!' });
        } catch (error) {
            console.log(error);
            return res.status(503).json({ msg: 'Server got some error. Please try again later.' });
        }
    }

    async logout(req, res) {
        req.session.destroy((error) => {
            if (error)
                return res.status(503).json({ msg: 'Server got some error. Please try again later.' });
            res.redirect('/');
        });
    }
}

module.exports = new UserController;