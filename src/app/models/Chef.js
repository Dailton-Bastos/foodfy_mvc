const { date } = require('../../libs/utils')

const db = require('../../config/database')

module.exports = {
  all(res, cb) {
    db.query(`SELECT * FROM chefs ORDER BY name`, (err, results) => {
      if (err || !results.rows) {
        throw Error(err)
      }
      return cb(results.rows)
    })
  },

  create(data, res, cb) {
    const query = `
    INSERT INTO chefs (name, avatar_url, created_at)
    VALUES ($1,$2,$3) RETURNING id
    `
    const { name, avatar_url } = data

    const values = [name, avatar_url, date(Date.now()).iso]

    db.query(query, values, (err, results) => {
      if (err || !results.rows[0]) {
        throw Error(err)
      }
      return cb(results.rows[0])
    })
  },

  find(id, res, cb) {
    const query = `
    SELECT chefs.*,
    COUNT(recipes) As total_recipes
    FROM chefs
    LEFT JOIN recipes
    ON (chefs.id = recipes.chef_id)
    WHERE chefs.id = $1
    GROUP BY chefs.id
    ORDER BY total_recipes DESC`

    const values = [id]

    db.query(query, values, (err, results) => {
      if (err || !results.rows[0]) {
        throw Error(err)
      }

      return cb(results.rows[0])
    })
  },

  update(data, res, cb) {
    const query = `UPDATE chefs SET name=($1), avatar_url=($2) WHERE id=$3`

    const { name, avatar_url, id } = data

    const values = [name, avatar_url, id]

    db.query(query, values, (err) => {
      if (err) {
        throw Error(err)
      }

      return cb()
    })
  },

  destroy(id, res, cb) {
    const query = `DELETE FROM chefs WHERE id = $1`

    const values = [id]

    db.query(query, values, (err) => {
      if (err) {
        throw Error(err)
      }
      return cb()
    })
  },

  paginate(params) {
    const { limit, offset, cb } = params

    const query = `SELECT chefs.*, (SELECT count(*) FROM chefs) AS total
      FROM chefs
      ORDER BY name
      LIMIT $1 OFFSET $2`

    db.query(query, [limit, offset], (err, results) => {
      if (err || !results.rows) {
        throw Error(err)
      }

      return cb(results.rows)
    })
  },
}
