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
        const authCart = req.get('AuthorizationCart')
        if(!authCart) return returnCartNull(req, next)
        const tokenUser = authCart.split(' ');
        if (tokenUser.length !== 2 ||
            tokenUser[0] !== 'Bearer' ||
            tokenUser[1] === '') return returnCartNull(req, next)

        let decodeCartToken;
        try {
            decodeCartToken = jwt.verify(tokenUser[1], process.env.SECRET);
        } catch (e) {
            return returnCartNull(req, next)
        }
        // decodeCartToken.username is email, since symfony is sending username,
        // so we use it same in node
        if (!decodeCartToken ||
            decodeCartToken.username === undefined
        ) return returnCartNull(req, next)
        let emailCart = await knex('user').select('email', 'roles')
            .where({email: decodeCartToken.username})
        if (emailCart[0] === undefined) return returnCartNull(req, next)
        req.isAuthCart = true;
        req.userCart = emailCart[0].email;
        req.roleCart =  emailCart[0].roles;
        return returnNull(req, next);
    }
    const token = authHeader.split(' ');
    if (token.length !== 2 || token[0] !== 'Bearer' || token[1] === '') return returnNull(req, next);
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
    let email = await knex('user').select('email')
        .where({email: decodedToken.username})
    if (email[0] === undefined) return returnNull(req, next);
    req.isAuth = true;
    req.userEmail = decodedToken.username;
    req.userRole = decodedToken.roles;
    next();
}

let returnNull = (req, next) => {
    req.isAuth = false;
    return next();
}

let returnCartNull = (req, next) => {
    req.isAuthCart = false
    return next();
}
