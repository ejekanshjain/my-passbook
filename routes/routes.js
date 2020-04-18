const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.json({ status: 200, message: 'API server up and running...' })
})

router.use('/users', require('./user'))
router.use('/signup', require('./signup'))
router.use('/signin', require('./signin'))
router.use('/profile', require('./profile'))
router.use('/changepassword', require('./changePassword'))
router.use('/passwords', require('./passwords'))

router.get('*', (req, res) => res.status(404).json({ status: 404, message: 'Not Found' }))

module.exports = router