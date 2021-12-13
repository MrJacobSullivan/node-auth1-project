const db = require('../../data/db-config')

const find = async () => await db('users').select('user_id', 'username')

const findBy = async (filter) => await db('users').where(filter)

const findById = async (user_id) => await findBy({ user_id })

const add = async (user) => {
  const [id] = await db('users').insert(user)
  return findById(id)
}

module.exports = {
  find,
  findBy,
  findById,
  add,
}
