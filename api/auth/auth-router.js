const router = require('express').Router()
const bcrypt = require('bcryptjs')
const Users = require('../users/users-model')
const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require('./auth-middleware')

router.post('/register', [checkUsernameFree, checkPasswordLength], async (req, res, next) => {
  try {
    const { username, password } = req.body

    const newUser = {
      username,
      password: bcrypt.hashSync(password, 8),
    }

    const [created] = await Users.add(newUser)
    res.status(201).json({ username: created.username, user_id: created.user_id })
  } catch (err) {
    next(err)
  }
})

router.post('/login', checkUsernameExists, async (req, res, next) => {
  try {
    const { username, password } = req.body

    const [userFromDb] = await Users.findBy({ username })

    if (userFromDb) {
      const verified = bcrypt.compareSync(password, userFromDb.password)

      if (verified) {
        req.session.user = userFromDb
        return res.json({ message: `welcome ${username}` })
      }
    }

    next({ status: 401, message: 'Invalid credentials' })
  } catch (err) {
    next(err)
  }
})

router.get('/logout', async (req, res, next) => {
  try {
    if (req.session.user) {
      req.session.destroy((err) => {
        if (err) {
          next(err)
        } else {
          res.json({ message: 'logged out' })
        }
      })
    } else {
      res.json({ message: 'no session' })
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
