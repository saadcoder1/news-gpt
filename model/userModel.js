let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let validator = require('validator');


let Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    authorized: {
        type: Boolean,
        required: true,
        default: false
    }
})


userSchema.statics.signupStatic = async function (email, password) {
    if (!email || !password) throw new Error('All fields must be filled.');
    if (!validator.isEmail(email)) throw new Error('Email is not valid');

    let exists = await this.findOne({ email });
    if (exists) {
        throw new Error('Email already in use.');
    }

    if (!validator.isStrongPassword(password)) throw new Error('Password must contain atleast 8 characters, one lowercase letter, one uppercase letter, one number, and one symbol (such as .!-)');


    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);

    // creating a user
    await this.create({ email, password: hash });
}


userSchema.statics.loginStatic = async function (email, password) {
    if (!email || !password) throw new Error('All fields must be filled.');

    let user = await this.findOne({ email });

    if (!user) throw new Error('Incorrect Email');

    let pwMatches = await bcrypt.compare(password, user.password);

    if (!pwMatches) throw new Error('Incorrect Password');

    return user;
}


let UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;