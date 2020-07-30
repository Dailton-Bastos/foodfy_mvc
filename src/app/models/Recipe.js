const db = require('../../config/database')

module.exports = {
  findAll(params) {
    try {
      const { limit, offset, userId } = params

      let query = `
        SELECT DISTINCT recipes.*,
        (SELECT COUNT(DISTINCT recipes) AS total FROM recipes),
        chefs.name AS chef
        FROM recipes
        INNER JOIN chefs
        ON (recipes.chef_id = chefs.id)
      `
      if (userId) {
        query = `${query}
          WHERE recipes.user_id = ${userId}
        `
      }
      query = `${query}
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `

      return db.query(query, [limit, offset])
    } catch (error) {
      throw new Error(error)
    }
  },

  create(data) {
    try {
      const query = `
        INSERT INTO recipes (
          title,
          ingredients,
          preparation,
          information,
          chef_id,
          user_id
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING id
      `

      const {
        title,
        ingredients,
        preparation,
        information,
        chef,
        user_id,
      } = data

      const values = [
        title,
        ingredients,
        preparation,
        information,
        chef,
        user_id,
      ]

      return db.query(query, values)
    } catch (error) {
      throw new Error(error)
    }
  },

  allChefs() {
    try {
      return db.query('SELECT id, name FROM chefs')
    } catch (error) {
      throw new Error(error)
    }
  },

  async findByPk(id) {
    try {
      const query = `
        SELECT recipes.*,
          ( SELECT COUNT(DISTINCT recipe_files) AS total_files
          FROM recipe_files
          WHERE recipe_id = $1 ),
        chefs.name AS chef
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
        ORDER BY recipes.title ASC
      `
      const results = await db.query(query, [id])
      return results.rows[0]
    } catch (error) {
      throw new Error(error)
    }
  },

  update(data) {
    try {
      const query = `
        UPDATE recipes SET
        title=($1),
        ingredients=($2),
        preparation=($3),
        information=($4),
        chef_id=($5)
        WHERE id=($6)
    `
      const { title, ingredients, preparation, information, chef, id } = data

      const values = [title, ingredients, preparation, information, chef, id]

      return db.query(query, values)
    } catch (error) {
      throw new Error(error)
    }
  },

  delete(id) {
    try {
      const query = 'DELETE FROM recipes WHERE id = $1'

      return db.query(query, [id])
    } catch (error) {
      throw new Error(error)
    }
  },

  mostAccessed() {
    const query = `
      SELECT recipes.*, chefs.name AS chef
      FROM recipes
      INNER JOIN chefs
      ON recipes.chef_id = chefs.id
      ORDER BY random()
      LIMIT 6
    `

    return db.query(query)
  },

  search(params) {
    const { filter, limit, offset } = params

    let query = ''
    let filterQuery = ''
    let totalQuery = `(SELECT count(*) AS total FROM recipes)`

    if (filter) {
      filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`

      totalQuery = `(SELECT count(*) FROM recipes ${filterQuery}) AS total`
    }

    query = `
      SELECT recipes.*, chefs.name AS chef,
      ${totalQuery}
      FROM recipes
      LEFT JOIN chefs
      ON (recipes.chef_id = chefs.id)
      ${filterQuery}
      ORDER BY updated_at DESC
      LIMIT $1 OFFSET $2
    `

    return db.query(query, [limit, offset])
  },

  files(recipe_id) {
    try {
      const query = `
        SELECT DISTINCT files.*, COUNT(*) AS total_files FROM files
        INNER JOIN recipe_files
          ON files.id = recipe_files.file_id
        INNER JOIN recipes
          ON recipe_files.recipe_id = $1
        GROUP BY files.id
    `
      return db.query(query, [recipe_id])
    } catch (error) {
      throw new Error(error)
    }
  },
}
