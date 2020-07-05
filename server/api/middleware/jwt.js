const jwt = require('jsonwebtoken');
const Tokens = require('../models/tokens');
const User = require('../models/user');

const jwtSecretString = 'suman';

function getAccessToken(payload) {
  return jwt.sign({user: payload}, jwtSecretString, { expiresIn: '1h' });
}

function getRefreshToken(payload) {

  const newRefreshToken = jwt.sign({user: payload}, jwtSecretString, { expiresIn: '7h' });

  Tokens.findOne({ userId: payload._id }, (err, tokens) => {
      if(err){
          throw err;
      } else{
          if(!tokens){
            throw new Error(`User Does Not Exist`);
          } else{
              if(tokens.refreshToken.length >= 5){
                tokens.refreshToken = [];
                tokens.refreshToken.push(newRefreshToken);
                tokens.save((err) => {
                    if(err) throw err;
                });
              } else{
                tokens.refreshToken.push(newRefreshToken);
                tokens.save((err) => {
                    if(err) throw err;
                });
              }
          }
      }
  });

  return newRefreshToken;
}

function verifyJWTToken(token) {
  return new Promise((resolve, reject) => {
    if (!token.startsWith('Bearer')) {
      return reject('Token is invalid');
    }
    token = token.slice(7, token.length);

    jwt.verify(token, jwtSecretString, (err, decodedToken) => {
      if (err) {
        return reject(err.message);
      }

      if (!decodedToken || !decodedToken.user) {
        return reject('Token is invalid');
      }

      resolve(decodedToken.user);
    })
  });
}

function refreshToken(sentToken) {
  const decodedToken = jwt.verify(sentToken, jwtSecretString);

  var newRefreshToken, newAccessToken;

  return User.findOne({ _id: decodedToken.user._id })
      .exec()
      .then(user => {
        if(!user){
          throw new Error(`Access is forbidden`);
        } 
        return Tokens.findOne({ userId: user._id })
                      .exec()
                      .then(token => {
                        if(!token){
                          throw new Error(`There is no refresh token for the user`);
                        }
                        return token;
                      })
                      .then(token => {
                        const currentRefreshToken = token.refreshToken.find(refreshToken => refreshToken == sentToken);
                        if (!currentRefreshToken) {
                          throw new Error(`Refresh token is wrong`);
                        }
                        const payload = {
                          _id : user._id,
                          email: user.email
                        };
                        newRefreshToken = getUpdatedRefreshToken(sentToken, payload);
                        newAccessToken = getAccessToken(payload);
                        return {
                          accessToken: newAccessToken,
                          refreshToken: newRefreshToken
                        };
                      })
      })
      .catch(error => {
          throw error;
      });
}

function getUpdatedRefreshToken(oldRefreshToken, payload) {
  const newRefreshToken = jwt.sign({user: payload}, jwtSecretString, { expiresIn: '7h' });

  User.findOne({ _id: payload._id }, (err, user) => {
      if(err){
          throw err;
      } else{
          Tokens.findOne({ userId: user._id }, (err, token) => {
              if(err){
                  throw err;
              } else{
                  token.refreshToken = token.refreshToken.map(refresh => {
                      if(refresh === oldRefreshToken){
                          return newRefreshToken;
                      }
                      return refresh;
                  });

                  token.save((error) => {
                    if(error) throw error;
                  });
              }
          })
      }
  });

  return newRefreshToken;
}

module.exports = {
  getAccessToken,
  getRefreshToken,
  verifyJWTToken,
  refreshToken
};