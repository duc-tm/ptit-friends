const db = require('../utils/db');
const queryStrings = require('../utils/db/queryString');
const userModel = require('../models/UserModel');
const accountModel = require('../models/AccountModel');
const { hash, compareHash } = require('../utils/bcrypt');
const userHelper = require('../helpers/userHelper');

class UserController {

    // [POST] /user/register
    async register(req, res) {
        const { username, password, email } = req.body;

        try {
            const result = await db.query(`${queryStrings.read.byUserName} OR email = $2`, [username, email]);

            if (result.rowCount > 0) {
                const msg = {};
                if (username === result.rows[0].username)
                    msg.username = 'Username is already exist';
                if (email === result.rows[0].email)
                    msg.email = 'Email is already exist';
                msg.state = false
                return res.json(msg);
            }

            const hashedPassword = await hash(password);
            await db.query(queryStrings.create.user, [username, hashedPassword, email]);

            res.status(201).json({ state: true });
        } catch (error) {
            console.log(error);
            return res.status(503).json({ msg: 'Server got some error. Please try again later.' });
        }
    }

    // [POST] /user/login
    async login(req, res) {
        const { username, password } = req.body;

        try {
            const result = await db.query(queryStrings.read.byUserName, [username]);

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

            res.json({ msg: 'Incorrect username or password!' });
        } catch (error) {
            console.log(error);
            return res.status(503).json({ msg: 'Server got some error. Please try again later.' });
        }
    }

    // [POST] /user/logout
    async logout(req, res) {
        req.session.destroy((error) => {
            if (error)
                return res.status(503).json({ msg: 'Server got some error. Please try again later.' });
            res.status(201).json({ state: true, redirectPath: '/welcome' });
        });
    }

    // [POST] /user/matching
    async matching(req, res) {
        const { preferHobbies, preferGender, preferAge, preferMajors } = req.body;
        const userId = req.session.user.userId;

        try {
            let result = await db.query(queryStrings.read.connectionList, [userId]);
            const connectedTargetIdList = result.rows.reduce((total, row) => {
                if (row.connectionstate) {
                    const connectedTargetId = row.user1id === userId ? row.user2id : row.user1id;
                    total.push(connectedTargetId);
                }
                return total;
            }, []);

            const countConnection = connectedTargetIdList.length;
            result = await db.query(
                (countConnection > 0 ? db.genQueryIn(countConnection,
                    queryStrings.read.randomUserList + ' AND userid NOT IN', 2)
                    : queryStrings.read.randomUserList
                )
                + ' ORDER BY RANDOM() LIMIT 20',
                [userId, preferGender, ...connectedTargetIdList]
            );

            let targetList = result.rows.map((row) => {
                return new userModel(row);
            });
            const targetIdList = targetList.map((target) => target.userId);
            let targetHobbyList = {};
            if (targetIdList.length > 0) {
                result = await db.query(
                    db.genQueryIn(targetIdList.length, queryStrings.read.userHobbies),
                    targetIdList
                );

                targetHobbyList = result.rows.reduce((total, hobby) => {
                    const userId = hobby.userid;
                    if (!total[userId]) total[userId] = new Map();
                    total[userId].set(hobby.hobbytype, true);
                    return total;
                }, {});
            }

            targetList = userHelper.calMatchingPoint(
                targetList, targetHobbyList, preferHobbies, preferAge, preferMajors
            );

            res.status(200).json(targetList);
        } catch (error) {
            console.log(error);
            res.status(503).json({ msg: 'Server got some error. Please try again later.' });
        }
    }

    // [GET] /user/get-info/:id
    async getUserInfo(req, res) {
        const { id: targetId } = req.params;

        try {
            const results = await Promise.all([
                db.query(queryStrings.read.byId, [targetId]),
                db.query(db.genQueryIn(1, queryStrings.read.userHobbies), [targetId])
            ]);

            const target = new userModel(results[0].rows[0]);
            target.hobbies = results[1].rows.map((row) => {
                return row.hobbytype;
            });

            res.status(200).json({ target })
        } catch (error) {
            console.log(error);
            res.status(503).json({ msg: 'Server got some error. Please try again later.' });
        }
    }

    // [POST] /user/send-friend-request
    async sendFriendRequest(req, res) {
        const { chosenList } = req.body;
        const userId = req.session.user.userId;

        try {
            await chosenList.forEach((targetId) => {
                db.query(queryStrings.create.friendRequest, [targetId, userId, false]);
            });

            res.status(201).json({ state: true });
        } catch (error) {
            console.log(error);
            res.status(503).json({ msg: 'Server got some error. Please try again later.' });
        }

    }

    // [GET] /user/friend-request
    async getFriendRequest(req, res) {
        const userId = req.session.user.userId;

        try {

            const results = await Promise.all([
                db.query(queryStrings.read.friendRequestList, [userId]),
                db.query(queryStrings.read.byId, [userId])
            ]);
            const senderList = results[0].rows.map((row) => {
                return new userModel(row);
            });
            const user = new userModel(results[1].rows[0]);

            res.render('friendrequest', { renderHeaderPartial: true, user, senderList });
        } catch (error) {
            console.log(error);
            res.status(503).json({ msg: 'Server got some error. Please try again later.' });
        }
    }

    // [POST] /user/respond-friend-request
    async respondFriendRequest(req, res) {
        const { targetId, responseState } = req.body;
        const userId = req.session.user.userId;

        try {
            await Promise.all([
                db.query(queryStrings.update.friendRequestState, [true, userId, targetId]),
                (responseState ?
                    [
                        db.query(queryStrings.create.chatConnection, [userId, targetId, true, false]),
                        db.query(queryStrings.create.messageBox, [userId, targetId])
                    ]
                    : true)
            ]);

            res.status(201).json({ state: true });
        } catch (error) {
            console.log(error);
            res.status(503).json({ msg: 'Server got some error. Please try again later.' });
        }
    }
}

module.exports = new UserController;