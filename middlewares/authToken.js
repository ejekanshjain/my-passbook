if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const accessToken = req.headers.authorization
    if (!accessToken)
        return res.status(401).json({ status: 401, message: 'Authorization is required!' })
    let data
    try {
        data = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET)
    } catch (err) {
        return res.status(401).json({ status: 401, message: 'Sign In First!' })
    }
    req.user = JSON.parse(data.data)
    next()
}