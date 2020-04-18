const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

const { User } = require('../models')
const { random } = require('../util')

router.post('/', async (req, res) => {
    const { name, email, gender, dateOfBirth, password } = req.body
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)
    try {
        await User.create({
            name,
            email,
            gender,
            dateOfBirth,
            password: hash,
            key: random(8)
        })
        res.status(201).json({ status: 201, message: 'Sign Up Successfull!' })
    } catch (err) {
        if (err.code === 11000)
            return res.status(400).json({ status: 400, message: 'User already exists!' })
        if (err.name)
            if (err.name === 'ValidationError')
                return res.status(400).json({ status: 400, message: err.message })
        console.log(err)
        res.status(500).json({ status: 500, message: 'Something Went Wrong!', error: err })
    }
})

module.exports = router