const express = require('express')

const router = express.Router()

const { User } = require('../models')
const { authToken } = require('../middlewares')
const { crypt } = require('../util')

router.use(authToken)

router.get('/', async (req, res) => {
    const user = await User.findOne({ _id: req.user._id })
    if (!user) return res.status(404).json({ status: 404, message: 'User Not Found!' })
    let passwords = user.passwords
    passwords.forEach(password => {
        password.username = crypt.decrypt(password.username, req.user.key)
        password.pass = crypt.decrypt(password.pass, req.user.key)
    })
    res.json({ status: 200, message: 'List of all Passwords!', passwords })
})

router.post('/', async (req, res) => {
    const { name, username, pass } = req.body
    if (!name || !username || !pass)
        return res.status(400).json({ status: 400, message: 'name, username and pass are required!' })
    const encryptedPass = crypt.encrypt(pass, req.user.key)
    const encryptedUsername = crypt.encrypt(username, req.user.key)
    let obj = { name, username: encryptedUsername, pass: encryptedPass }
    await User.updateOne({
        _id: req.user._id
    }, {
        $push: {
            passwords: obj
        }
    })
    res.status(201).json({ status: 201, message: 'Password Saved Successfully!' })
})

router.patch('/', async (req, res) => {
    const { _id, name, username, pass } = req.body
    if (!_id || !name || !username || !pass)
        return res.status(400).json({ status: 400, message: '_id, name, username and pass are required!' })
    const encryptedPass = crypt.encrypt(pass, req.user.key)
    const encryptedUsername = crypt.encrypt(username, req.user.key)
    try {
        await User.updateOne({
            _id: req.user._id,
            'passwords._id': _id
        }, {
            $set: {
                'passwords.$.name': name,
                'passwords.$.username': encryptedUsername,
                'passwords.$.pass': encryptedPass
            }
        })
        res.json({ status: 200, message: 'Password updated Successfully!' })
    } catch (err) {
        if (err.name === 'CastError') return res.status(400).json({ status: 400, message: 'Invalid Object Id!' })
        console.log(err)
        res.status(500).json({ status: 500, message: 'Something Went Wrong!' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await User.updateOne({
            _id: req.user._id
        }, {
            $pull: {
                passwords: {
                    _id: req.params.id
                }
            }
        })
        res.status(200).json({ status: 200, message: 'Password Deleted Successfully!' })
    } catch (err) {
        if (err.name === 'CastError') return res.status(400).json({ status: 400, message: 'Invalid Object Id!' })
        console.log(err)
        res.status(500).json({ status: 500, message: 'Something Went Wrong!' })
    }
})

module.exports = router