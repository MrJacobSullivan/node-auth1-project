const User = require('../users/users-model')

const restricted = (req, res, next) => {
  if (req.session.user) return next()
  next({ status: 401, message: 'You shall not pass!' })
}

const checkUsernameFree = (req, res, next) => {
  return User.findBy({ username: req.body.username }).then((user) => {
    if (!user) return next()
    next({ status: 422, message: 'Username taken' })
  })
}

const checkUsernameExists = (req, res, next) => {
  return User.findBy({ username: req.body.username }).then((user) => {
    if (user) return next()
    next({ status: 401, message: 'Invalid credentials' })
  })
}

const checkPasswordLength = (req, res, next) => {
  if (req.body.password !== undefined && req.body.password.length > 3) return next()
  next({ status: 422, message: 'Password must be longer than 3 chars' })
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
}
