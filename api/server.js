const express = require('express')
const session = require('express-session')
const Store = require('connect-session-knex')(session)
const helmet = require('helmet')
const cors = require('cors')

const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')

const server = express()

server.use(helmet())

server.use(
  session({
    name: 'chocolatechip',
    secret: process.env.SESSION_SECRET || '5f1bc20a-5c69-11ec-bf63-0242ac130002',
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
      httpOnly: false,
    },
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: new Store({
      knex: require('../data/db-config'),
      tablename: 'sessions',
      sidfieldname: 'sid',
      createtable: true,
      clearInterval: 1000 * 60 * 60,
    }),
  })
)

server.use(express.json())
server.use(cors())

server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter)

server.get('/', (req, res) => {
  res.json({ api: 'up' })
})

// eslint-disable-next-line
server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = server
