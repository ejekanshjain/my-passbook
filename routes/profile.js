const express = require('express')

const router = express.Router()

const { User } = require('../models')
const { authToken } = require('../middlewares')

router.use(authToken)

router.get('/', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id })
        if (!user) return res.status(404).json({ status: 404, message: 'User Not Found!' })
        let userProfile = {
            _id: user._id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
        res.json({ status: 200, message: 'Your Profile', userProfile })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, message: 'Something Went Wrong!' })
    }
})

router.patch('/', async (req, res) => {
    const { name, email, gender, dateOfBirth } = req.body
    let user
    try {
        user = await User.findOne({ _id: req.user._id })
        if (!user) return res.status(404).json({ status: 404, message: 'User Not Found!' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, message: 'Something Went Wrong!' })
    }
    user.name = name
    user.email = email
    user.gender = gender
    user.dateOfBirth = dateOfBirth
    try {
        await user.save()
        res.status(200).json({ status: 200, message: 'Profile Updated Successfully' })
    } catch (err) {
        if (err.code === 11000)
            return res.status(400).json({ status: 400, message: 'User already exists!' })
        if (err.name)
            if (err.name === 'ValidationError')
                return res.status(400).json({ status: 400, message: err.message })
        console.log(err)
        res.status(500).json({ status: 500, message: 'Something Went Wrong!' })
    }
})

module.exports = router