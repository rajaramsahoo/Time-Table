
const jwt = require('jsonwebtoken');


function authMiddleware(req, res, next) {

    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(
            token,

            process.env.JWT_SECRET
        );

        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
    }

}
module.exports = { authMiddleware }