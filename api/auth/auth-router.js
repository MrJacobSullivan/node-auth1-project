const express = require('express')
const bcrypt = require('bcryptjs')
const Users = require('../users/users-model')
const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require('./auth-middleware')

const router = express.Router()

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
router.post('/register', [checkUsernameFree, checkPasswordLength], async (req, res, next) => {
  try {
    const { username, password } = req.body

    const newUser = {
      username,
      password: bcrypt.hashSync(password, 10),
    }

    const created = await Users.add(newUser)
    res.status(201).json({ username: created.username, user_id: created.user_id })
  } catch (err) {
    next(err)
  }
})

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
router.post('/login', [], async (req, res, next) => {
  try {
    const { username, password } = req.body

    const [userFromDb] = await Users.findBy({ username })

    const invalidCredentials = { status: 401, message: 'Invalid credentials' }

    if (!userFromDb) return next(invalidCredentials)

    const verified = bcrypt.compareSync(password, userFromDb.password)
    if (!verified) return next(invalidCredentials)

    res.session.user = userFromDb
    res.json({
      username: userFromDb.username,
      user_id: userFromDb.user_id,
      message: `welcome back ${username}`,
    })
  } catch (err) {
    next(err)
  }
})

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router
