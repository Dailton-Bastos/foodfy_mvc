const db = require('../../config/database')
const { date } = require('../../libs/utils')

module.exports = {
  all(res, params, cb) {
    const { limit, offset } = params

    const query = `
    SELECT recipes.*,
    (SELECT count(*) FROM recipes) AS total,
    chefs.name AS chef
    FROM recipes
    LEFT JOIN chefs
    ON (recipes.chef_id = chefs.id)
    ORDER BY recipes.title ASC
    LIMIT $1 OFFSET $2
    `
    db.query(query, [limit, offset], (err, results) => {
      if (err || !results.rows) {
        throw Error(err)
      }

      return cb(results.rows)
    })
  },

  create(data, res, cb) {
    const query = `
    INSERT INTO recipes (
      chef_id,
      title,
      image_url,
      ingredients,
      preparation,
      information,
      created_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id
    `

    const {
      image_url,
      title,
      ingredients,
      preparation,
      information,
      chef,
    } = data

    const values = [
      chef,
      title,
      image_url,
      ingredients,
      preparation,
      information,
      date(Date.now()).iso,
    ]

    db.query(query, values, (err, results) => {
      if (err || !results.rows[0]) {
        throw Error(err)
      }
      return cb(results.rows[0])
    })
  },

  selectChef(res, cb) {
    const query = `SELECT id, name FROM chefs`

    db.query(query, (err, results) => {
      if (err || !results.rows) {
        throw Error(err)
      }
      return cb(results.rows)
    })
  },

  find(id, res, cb) {
    const query = `
    SELECT recipes.*, chefs.name AS chef
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE recipes.id = $1
    ORDER BY recipes.title ASC
    `

    db.query(query, [id], (err, results) => {
      if (err || !results.rows[0]) {
        throw Error(err)
      }

      return cb(results.rows[0])
    })
  },

  update(data, res, cb) {
    const query = `
      UPDATE recipes SET
      chef_id=($1),
      title=($2),
      image_url=($3),
      ingredients=($4),
      preparation=($5),
      information=($6)
      WHERE id=($7)
    `
    const {
      chef,
      title,
      image_url,
      ingredients,
      preparation,
      information,
      id,
    } = data

    const values = [
      chef,
      title,
      image_url,
      ingredients,
      preparation,
      information,
      id,
    ]

    db.query(query, values, (err, results) => {
      if (err || !results.rows) {
        throw Error(err)
      }

      return cb()
    })
  },

  destroy(id, res, cb) {
    const query = `DELETE FROM recipes WHERE id = $1`

    db.query(query, [id], (err) => {
      if (err) {
        throw Error(err)
      }
      return cb()
    })
  },

  mostAccessed(res, cb) {
    const query = `
    SELECT recipes.id, recipes.title, recipes.image_url, chefs.name AS chef
    FROM recipes
    INNER JOIN chefs
    ON recipes.chef_id = chefs.id
    ORDER BY random()
    LIMIT 6
    `

    db.query(query, (err, results) => {
      if (err || !results.rows) throw Error(err)

      return cb(results.rows)
    })
  },

  search(res, params, cb) {
    const { filter, limit, offset } = params

    let query = ''
    let filterQuery = ''
    let totalQuery = `(SELECT count(*) AS total FROM recipes)`

    if (filter) {
      filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`

      totalQuery = `(SELECT count(*) FROM recipes ${filterQuery}) AS total`
    }

    query = `
      SELECT recipes.id,
      recipes.image_url,
      recipes.title,
      chefs.name AS chef,
      ${totalQuery}
      FROM recipes
      LEFT JOIN chefs
      ON (recipes.chef_id = chefs.id)
      ${filterQuery}
      ORDER BY recipes.title
      LIMIT $1 OFFSET $2
    `

    db.query(query, [limit, offset], (err, results) => {
      if (err || !results.rows) {
        throw Error(err)
      }

      return cb(results.rows)
    })
  },
}
