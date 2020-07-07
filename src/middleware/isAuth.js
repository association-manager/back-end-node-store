import jwt from 'jsonwebtoken';

module.exports = (req, res, next) => {
    return next();
    const authHeader = req.get('Authorization')
    if(!authHeader)  return returnNull(req, res, 'Unauthenticated');
    const token = authHeader.split(' ');
    if (token.length !== 2 || token[0] !== 'Bearer' || token[1] === '') return returnNull(req, res,'Error in token format');
    let decodedToken;
    try {
    decodedToken = jwt.verify(token[1], process.env.SECERT);
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
