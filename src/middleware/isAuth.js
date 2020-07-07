import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import knex from "../sql";

module.exports = async (req, res, next) => {
    const authHeader = req.get('Authorization')
    if(!authHeader)  return returnNull(req, res, 'Unauthenticated');
    const token = authHeader.split(' ');
    if (token.length !== 2 || token[0] !== 'Bearer' || token[1] === '') return returnNull(req, res,'Error in token format');
    let decodedToken;
    let publicKey = fs.readFileSync(path.resolve(__dirname + '../../../jwt/public.key'), 'utf8'); // get data as string content
    try {
    decodedToken = jwt.verify(token[1], publicKey, {
        algorithm: 'RS256'
    });
    } catch (e) {
        return returnNull(req, res,'Unauthenticated: Error while verification');
    }
    if (!decodedToken) return returnNull(req, res,'Unauthenticated: Token is not authenticated');
    req.isAuth = true;
    req.userEmail = decodedToken.username;
    req.userRole = decodedToken.roles;
    console.log(req);

    let email = await  knex('user').select('email')
        .where({ email: decodedToken.username })
    if(email[0] === undefined) return returnNull(req, res, 'Unauthenticated: Not a valid user');;
    next();
}

let returnNull = (req, res, message) => {
    req.isAuth = false;
    res.status(401)
    res.send({message})
    return res;
}
