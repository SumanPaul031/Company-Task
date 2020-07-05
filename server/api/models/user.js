const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

let validEmailChecker = (email) => {
    if(!email){
        return false;
    } else{
        const regExp = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
        return regExp.test(email);
    }
}

const emailValidators = [
    {
        validator: validEmailChecker,
        message: 'Please enter a valid email'
    }
];

const userSchema = new Schema({
    email: { type: String, required: true, lowercase: true, unique: true, validate: emailValidators },
    name: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);