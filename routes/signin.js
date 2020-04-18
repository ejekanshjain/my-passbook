if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()

const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET
const { User } = require('../models')

router.post('/', async (req, res) => {
    const { email, password } = req.body
    const foundUser = await User.findOne({ email })
    if (!foundUser)
        return res.status(400).json({ status: 400, message: 'Incorrect Email or Password!' })
    if (!await bcrypt.compare(password, foundUser.password))
        return res.status(400).json({ status: 400, message: 'Incorrect Email or Password!' })
    const user = {
        _id: foundUser._id,
        key: foundUser.key
    }
    const accessToken = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: JSON.stringify(user)
    }, accessTokenSecret)
    res.json({
        status: 200,
        message: 'Sign In Successfull!',
        user: {
            _id: foundUser._id,
            name: foundUser.name,
            email: foundUser.email
        },
        accessToken
    })
})

module.exports = router