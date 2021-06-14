class User {
    constructor({ userid, fname, age, gender, major, address }) {
        this.userId = userid;
        this.fName = fname;
        this.age = age;
        this.gender = gender;
        this.major = major;
        this.address = address;
    }
}

module.exports = User;