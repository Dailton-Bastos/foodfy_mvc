const { hash } = require('bcryptjs')
const db = require('../../config/database')

module.exports = {
  async findAll(params) {
    const { limit, offset } = params

    const query = `
      SELECT users.id, users.name, users.email, users.is_admin,
      (SELECT DISTINCT COUNT(*) FROM users) AS total
      FROM users
      ORDER BY users.created_at DESC
      LIMIT $1 OFFSET $2
    `

    return db.query(query, [limit, offset])
  },

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

  async findByPk(pk) {
    const query = 'SELECT users.* FROM users WHERE id = $1'

    try {
      const user = await db.query(query, [pk])

      return user.rows[0]
    } catch (error) {
      throw new Error(error)
    }
  },

  async update(id, fields) {
    let query = 'UPDATE users SET'

    try {
      Object.keys(fields).forEach((key, index, array) => {
        if (index + 1 < array.length) {
          query = `${query} ${key} = '${fields[key]}',`
        } else {
          query = `${query} ${key} = '${fields[key]}' WHERE id = ${id}`
        }
      })

      await db.query(query)
    } catch (error) {
      throw new Error(error)
    }
  },
}
