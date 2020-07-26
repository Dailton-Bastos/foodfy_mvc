const { hash } = require('bcryptjs')
const db = require('../../config/database')

module.exports = {
  async findOne(filters) {
    try {
      let query = `
      SELECT users.* FROM users`

      Object.keys(filters).forEach((key) => {
        query = `${query} ${key}`

        Object.keys(filters[key]).forEach((field) => {
          query = `${query} ${field} = '${filters[key][field]}'`
        })
      })

      const user = await db.query(query)

      return user.rows[0]
    } catch (error) {
      throw new Error(error)
    }
  },

  async create({ name, email, password, is_admin }) {
    try {
      const query = `
      INSERT INTO users (
        name,
        email,
        password,
        is_admin
      ) VALUES ($1, $2, $3, $4)
      RETURNING id
    `
      password = await hash(password, 8)

      const values = [name, email, password, is_admin]

      return db.query(query, values)
    } catch (error) {
      throw new Error(error)
    }
  },
}
