const { unlinkSync } = require('fs')
const db = require('../../config/database')

module.exports = {
  create({ filename, path }) {
    try {
      const query = `
        INSERT INTO files (name, path ) VALUES ($1, $2)
        RETURNING id
      `
      const values = [filename, path]

      return db.query(query, values)
    } catch (error) {
      throw new Error(error)
    }
  },

  async delete(file_id) {
    let query = ''

    try {
      query = 'SELECT * FROM files WHERE id = $1'
      const result = await db.query(query, [file_id])

      const { path } = result.rows[0]

      if (path) unlinkSync(path)

      query = 'DELETE FROM files WHERE id = $1'
      return db.query(query, [file_id])
    } catch (error) {
      throw new Error(error)
    }
  },
}
