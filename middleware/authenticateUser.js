let UserModel = require('../model/userModel');
let jwt = require('jsonwebtoken');

async function authenticateUser(req, res, next) {
    let { authorization } = req.headers;

    if (!authorization) {
        res.status(400).json('Token not present.');
    }

    let token = authorization.split(' ')[1];

    try {
        let _id = jwt.verify(token, process.env.JWTSECRET);

        let user = UserModel.findOne({ _id });

        if(!user) throw new Error();

        next();

    } catch (err) {
        res.status(401).json('User not authorized.')
    }
}


module.exports = authenticateUser;