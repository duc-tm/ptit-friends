const { hash, compareHash } = require('../utils/bcrypt');

const db = require('../utils/db');
const queryStrings = require('../utils/db/queryString');
const { mapRows } = require('../utils/db/rowMapper');

const accountModel = require('./AccountModel');
const messageBoxModel = require('./MessageBoxModel');
const connectionModel = require('./ConnectionModel');
const friendRequestModel = require('./FriendRequestModel');

class User {

    static getInstance({ userid, fname, age, gender, major, address }) {
        return {
            userId: userid,
            fName: fname,
            age,
            gender,
            major,
            address,
        }
    }

    static async getUserById(userId) {
        const result = await db.query(queryStrings.read.byId, [userId]);
        return mapRows(result.rows, result.rowCount, this);
    }

    static async getUserByIds(userIds) {
        const result = await db.query(
            db.genQueryIn(userIds.length, queryStrings.read.userList, 'WHERE', false, 'userid'),
            userIds
        );
        return mapRows(result.rows, result.rowCount, this);
    }

    /* 
    *PARAMS
        username - username submitted by user
        submitPassword - password submitted by user
    *RETURN
        User object - authentication success
        False - authentication failed
        Error object - authentication got error
    */
    static async auth({ username, password: submitPassword }) {
        try {
            const result = await db.query(queryStrings.read.byUserName, [username]);

            if (result.rowCount > 0) {
                const account = accountModel.getInstance(result.rows[0]);
                const user = this.getInstance(result.rows[0]);
                const isMatch = await compareHash(submitPassword, account.password);

                if (isMatch && (account.role !== undefined && account.role !== null)) {
                    return { state: true, user, role: account.role };
                }
            }

            return { state: false };
        } catch (error) {
            console.log(error);
            return { state: false, error };
        }
    }

    /* 
    *PARAMS
        quantity - number of user to get
        preferGender - prefer gender of user
        except - array of except user's id
    *RETURN
        Array of User
    */
    static async getRandomUsers(quantity, preferGender, except = []) {
        const queryString = db.genQueryIn(
            except.length,
            queryStrings.read.usersByGender,
            'AND',
            true,
            'userid',
            1
        );

        const result = await db.query(
            db.genQueryRandom(quantity, queryString),
            [preferGender, ...except]
        );

        return mapRows(result.rows, result.rowCount, this);
    }

    /* 
    *PARAMS
        userIdArr - array of user id need to get hobbies
    *RETURN
        Array of object contain user's id and hobby type
    */
    static async getUsersHobbies(userIdArr) {
        if (userIdArr.length <= 0) return [];

        const result = await db.query(
            db.genQueryIn(userIdArr.length, queryStrings.read.userHobbies, 'AND', false, 'users.userid'),
            userIdArr
        );

        return mapRows(result.rows, result.rowCount, {
            getInstance: ({ userid, hobbytype }) => ({ userId: userid, hobbyType: hobbytype })
        });
    }

    static async getFriendRequestList(userId) {
        const result = await db.query(queryStrings.read.friendRequestList, [userId]);
        return mapRows(result.rows, result.rowCount, this);
    }

    static async respondFriendRequest(userId, senderId, responseState) {
        try {
            await Promise.all([
                friendRequestModel.changeState(true, userId, senderId),
                (responseState ?
                    [
                        connectionModel.createConnections(userId, senderId, true, false),
                        messageBoxModel.createMessageBox(userId, senderId)
                    ]
                    : true
                )
            ]);

        } catch (error) {
            console.log(error);

        }
    }
}

module.exports = User;