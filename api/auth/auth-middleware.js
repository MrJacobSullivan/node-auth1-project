const Users = require('../users/users-model')

const restricted = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    next({ status: 401, message: 'You shall not pass!' })
  }
}

const checkUsernameFree = async (req, res, next) => {
  try {
    const { username } = req.body
    const [user] = await Users.findBy({ username })

    if (!user) {
      next()
    } else {
      next({ status: 422, message: 'Username taken' })
    }
  } catch (err) {
    next(err)
  }
}

const checkUsernameExists = async (req, res, next) => {
  try {
    const user = Users.findBy({ username: req.body.username })

    if (user) {
      next()
    } else {
      next({ status: 401, message: 'Invalid credentials' })
    }
  } catch (err) {
    next(err)
  }
}

const checkPasswordLength = (req, res, next) => {
  if (req.body.password.length > 3) {
    next()
  } else {
    next({ status: 422, message: 'Password must be longer than 3 chars' })
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
}
