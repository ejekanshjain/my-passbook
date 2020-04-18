const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

const { User } = require('../models')
const { authToken } = require('../middlewares')

router.use(authToken)

router.patch('/', async (req, res) => {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ status: 400, message: 'Current Password and New Password are required!' })
    if (currentPassword === newPassword) return res.status(400).json({ status: 400, message: 'New Password cannot be same as Current Password!' })
    const user = await User.findOne({ _id: req.user._id })
    if (!user) return res.status(404).json({ status: 404, message: 'User Not Found!' })
    if (!await bcrypt.compare(currentPassword, user.password)) return res.status(400).json({ status: 400, message: 'Current Password is Incorrect!' })
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(newPassword, salt)
    user.password = hash
    try {
        await user.save()
        res.json({ status: 200, message: 'Password Updated Successfully!' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, message: 'Something Went Wrong!' })
    }
})

module.exports = router