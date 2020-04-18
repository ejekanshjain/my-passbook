if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

const port = process.env.PORT
const { MongoDB } = require('./db')
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
const NotFoundFile = path.join(__dirname, '/public/404.html')

const app = express()

app.use(cors({
    origin: '*',
    methods: 'GET,POST,PATCH,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
}))
app.use(morgan('combined', { stream: accessLogStream }))
app.use(express.json())
app.use(express.static('public'))

app.use('/api', require('./routes'))

app.get('*', (req, res) => res.sendFile(NotFoundFile))

app.listen(port, () => console.log(`${process.env.NODE_ENV !== 'production' ? 'Development' : 'Production'} Server started on port ${port}...`))