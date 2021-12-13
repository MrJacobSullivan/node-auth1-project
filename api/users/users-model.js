const db = require('../../data/db-config')

/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
const find = () => db('users').select('user_id', 'username')

/**
  resolves to an ARRAY with all users that match the filter condition
 */
const findBy = (filter) => db('users').where(filter)

/**
  resolves to the user { user_id, username } with the given user_id
 */
const findById = (user_id) => db('users').where({ user_id }).first()

/**
  resolves to the newly inserted user { user_id, username }
 */
const add = async (user) => {
  const [id] = await db('users').insert(user)

  return findById(id)
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  find,
  findBy,
  findById,
  add,
}
