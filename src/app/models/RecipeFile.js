const { unlinkSync } = require('fs')
const db = require('../../config/database')

module.exports = {
  create(recipe, file) {
    try {
      const query = `
        INSERT INTO recipe_files ( recipe_id, file_id ) VALUES ($1, $2)
        RETURNING id
    `
      const values = [recipe, file]

      return db.query(query, values)
    } catch (error) {
      throw new Error(error)
    }
  },

  async delete(file_id) {
    let query = ''

    try {
      query = 'DELETE FROM recipe_files WHERE file_id = $1'
      await db.query(query, [file_id])

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

  async fileRecipesUser(userId) {
    const query = `
      SELECT DISTINCT file_id AS id
      FROM recipe_files
      INNER JOIN recipes
      ON recipe_files.recipe_id = recipes.id
      INNER JOIN users
      ON recipes.user_id = $1
      ORDER BY file_id
    `

    const results = await db.query(query, [userId])

    return results.rows
  },
}
