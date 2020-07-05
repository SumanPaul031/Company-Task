const jwt = require('jsonwebtoken');
const jwtService = require('./jwt');

const auths = {};

auths.userAuth = (req, res, next) => {
    const token = req.get('Authorization');

    if (!token) {
      return res.status(401).send('Token is invalid');
    }
  
    jwtService.verifyJWTToken(token).then(user => {
        req.user = user;
        next();
    }).catch(err => {
      res.status(401).send(err);
    });
};

module.exports = auths