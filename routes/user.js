const express = require('express')

const router = express.Router()

const { User } = require('../models')
const { authAdmin } = require('../middlewares')

router.use(authAdmin)

router.get('/', async (req, res) => {
    const users = await User.find()
    res.json({ status: 200, message: 'List of all users', users })
})

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        if (!user) return res.status(404).json({ status: 404, message: 'User Not Found!' })
        res.json({ status: 200, message: 'Found User', user })
    } catch (err) {
        if (err.message)
            if (err.message.includes('Cast to ObjectId failed'))
                return res.status(404).json({ status: 404, message: 'User Not Found!' })
        console.log(err)
        res.status(500).json({ status: 500, message: 'Something Went Wrong!' })
    }
})

module.exports = router