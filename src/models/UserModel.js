class User {
    constructor({ userId, fName, age, gender, major, address }) {
        this.userId = userId;
        this.fName = fName;
        this.age = age;
        this.gender = gender;
        this.major = major;
        this.address = address;
    }
}

module.exports = User;