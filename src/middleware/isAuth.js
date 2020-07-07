import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import knex from "../sql";

module.exports = async (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        const cartHeader = req.get('Shopping-Cart')
        if (!cartHeader || cartHeader !== 'associationManager') {
            res.status(401);
            res.send({'message':'Unauthenticated Access'})
            return res
        }
        return returnNull(req, next);
    }
    const token = authHeader.split(' ');
    if (token.length !== 2 || token[0] !== 'Bearer' || token[1] === '') return returnNull(req, next,);
    let decodedToken;
    let publicKey = fs.readFileSync(
        path.resolve(
            __dirname + '../../../jwt/public.key'),
        'utf8'
    ); // get data as string content
    try {
        decodedToken = jwt.verify(token[1], publicKey, {
            algorithm: 'RS256'
        });
    } catch (e) {
        return returnNull(req, next);
    }
    if (!decodedToken) return returnNull(req, next);
    req.isAuth = true;
    req.userEmail = decodedToken.username;
    req.userRole = decodedToken.roles;
    let email = await knex('user').select('email')
        .where({email: decodedToken.username})
    if (email[0] === undefined) return returnNull(req, next);
    next();
}

let returnNull = (req, next) => {
    req.isAuth = false;
    return next();
}
