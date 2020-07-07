import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if(!authHeader)  return returnNull(req, res, 'Unauthenticated');
    const token = authHeader.split(' ');
    if (token.length !== 2 || token[0] !== 'Bearer' || token[1] === '') return returnNull(req, res,'Error in token format');
    let decodedToken;
    //console.log(process.env.SECRET)
    let a = path.resolve(__dirname + '../../../jwt/public.key');
    console.log(a);
    let publicKey = fs.readFileSync(a, 'utf8'); // get data as string content
    console.log(publicKey);
    let verifyOptions = {
        algorithm: 'RS256'
    }
    try {
    decodedToken = jwt.verify(token[1], publicKey, verifyOptions);
    } catch (e) {
        return returnNull(req, res,'Error while verification');
    }
    if (!decodedToken) return returnNull(req, res,'Token is not authenticated');
    req.isAuth = true
    req.userId = decodedToken.user.id
    next();
}

let returnNull = (req, res, message) => {
    req.isAuth = false;
    res.status(401)
    res.send({message})
    return res;
}
