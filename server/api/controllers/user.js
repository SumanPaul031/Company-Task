const User = require('../models/user');
const Tokens = require('../models/tokens');

const mongoose = require('mongoose');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const jwtService = require('../middleware/jwt');

exports.signUp = (req, res, next) => {
    if(!req.body.email){
        return res.status(400).json({ success: false, message: 'Please Provide an Email' });
    } else{
        if(!req.body.name){
            return res.status(400).json({ success: false, message: 'Please Provide a Name' });
        } else{
            if(!req.body.password){
                return res.status(400).json({ success: false, message: 'Please Provide a Password' });
            } else{
                let hash = passwordHash.generate(req.body.password);
                let user = createUser(req.body.name, req.body.email, hash);

                user.save().then((user) => {
                    let token = new Tokens({
                        userId: user._id,
                        refreshToken: []
                    });
                    token.save().then(() => {
                        return res.status(201).json({
                            message: 'User Registered successfully!'
                        });
                    }); 
                }).catch((err) => {
                    if(err.name === 'MongoError'){
                        if(err.code === 11000){
                            if(err.keyPattern.email){
                                return res.status(400).json({ success: false, message: 'Email already exists' });
                            }
                        }
                    } else if(err.name === 'ValidationError'){
                        if(err.errors.email){
                            return res.status(400).json({ success: false, message: err.errors.email.message });
                        }
                    } else{
                        return res.status(500).json({ success: false, message: 'Could Not Save User. Error: '+err });
                    }
                })
            }
        }
    }
};

exports.logIn = (req, res, next) => {
    if(!req.body.email){
        return res.status(400).json({ success: false, message: 'Please Provide an Email' });
    } else{
        if(!req.body.password){
            return res.status(400).json({ success: false, message: 'Please Provide a Password' });
        } else{
            User.findOne({ email: req.body.email }, (err, user) => {
                if(err){
                    return res.status(500).json(err);
                } else{
                    if(!user){
                        return res.status(404).json({
                            message: 'Email does not exist'
                        });
                    } else{
                        let passwordVerify = passwordHash.verify(req.body.password, user.password);
                        if(!passwordVerify){
                            return res.status(400).json({
                                message: 'Password Incorrect'
                            });
                        } else{
                            let payload = {
                                _id: user._id,
                                email: user.email
                            };
                            
                            const accessToken = jwtService.getAccessToken(payload);
                            const refreshToken = jwtService.getRefreshToken(payload);

                            return res.status(200).json({
                                message: 'Login Successful!',
                                user,
                                accessToken,
                                refreshToken
                            });
                        }
                    }
                }
            })
        }
    }
};

exports.refreshToken = (req, res, next) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(403).send('Access is forbidden');
    }

    try {
        jwtService.refreshToken(refreshToken).then(newTokens => {
            return res.send(newTokens);
        });
    } catch (err) {
        const message = (err && err.message) || err;
        return res.status(403).send(message);
    }
}

exports.currentUser = (req, res, next) => {
    User.findOne({ _id: req.user._id })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(403).json({
                    message: 'Auth Failed'
                });
            }
            return user;
        })
        .then(user => {
            if (user) {
                return res.send(user);
            }
        })
        .catch(error => {
            return res.status(500).json(error);
        });
};

function createUser(name, email, hash) {
    return new User({
        email: email,
        name: name,
        password: hash
    });
}