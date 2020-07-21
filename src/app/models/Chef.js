const db = require('../../config/database')

module.exports = {
  all(params) {
    const { limit, offset } = params

    const query = `
      SELECT chefs.*, COUNT(recipes) AS total_recipes,
      (SELECT DISTINCT COUNT(*) FROM chefs) AS total
      FROM chefs
      LEFT JOIN recipes
      ON chefs.id = recipes.chef_id
      GROUP BY chefs.id
      ORDER BY chefs.name
      LIMIT $1 OFFSET $2
    `

    return db.query(query, [limit, offset])
  },

  create(data) {
    const query = `
      INSERT INTO chefs (
        name,
        file_id
      ) VALUES ($1,$2)
    RETURNING id`

    const { name, file_id } = data

    const values = [name, file_id]

    return db.query(query, values)
  },

  find(id) {
    const query = `
      SELECT chefs.*,
      COUNT(recipes) As total_recipes
      FROM chefs
      LEFT JOIN recipes
      ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      GROUP BY chefs.id
      ORDER BY total_recipes DESC`

    return db.query(query, [id])
  },

  avatar(id) {
    const query = `
      SELECT files.id, files.name, files.path
      FROM files
      WHERE id = $1
    `

    return db.query(query, [id])
  },

  recipes(id, params) {
    const { limit, offset } = params

    const query = `
      SELECT recipes.*,
      (SELECT count(*) FROM recipes WHERE chef_id = $1) AS total
      FROM recipes
      WHERE chef_id = $1
      GROUP BY recipes.id
      ORDER BY recipes.title
      LIMIT $2 OFFSET $3
      `

    return db.query(query, [id, limit, offset])
  },

  async update(data) {
    const { name, id, file_id, removed_files } = data

    let values = [name, id]

    let query = 'UPDATE chefs SET name=($1) WHERE id=($2)'
    const queryFile = 'UPDATE chefs SET name=($1), file_id=($2) WHERE id=($3)'

    if (removed_files) {
      query = queryFile
      values = [name, null, id]
    }

    if (file_id) {
      query = queryFile
      values = [name, file_id, id]
    }

    return db.query(query, values)
  },

  delete(id) {
    const query = `DELETE FROM chefs WHERE id = $1`

    return db.query(query, [id])
  },
}
