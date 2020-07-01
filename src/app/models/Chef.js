const { date } = require('../../libs/utils')

const db = require('../../config/database')

module.exports = {
  all(res, params, cb) {
    const { limit, offset } = params

    const query = `
      SELECT chefs.*, COUNT(recipes) AS total_recipes,
      (SELECT DISTINCT count(*) FROM chefs) AS total
      FROM chefs
      LEFT JOIN recipes
      ON chefs.id = recipes.chef_id
      GROUP BY chefs.id
      ORDER BY chefs.name
      LIMIT $1 OFFSET $2
    `

    db.query(query, [limit, offset], (err, results) => {
      if (err || !results.rows) {
        return res.render('_partials/not-found', {
          info: {
            msg: 'Error ao listar chefs',
            page_title: 'Error ou página não encontrada',
          },
        })
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
        return res.render('_partials/not-found', {
          info: {
            msg: 'Error ao salvar chef',
            page_title: 'Error ou página não encontrada',
          },
        })
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
        return res.render('_partials/not-found', {
          info: {
            msg: 'Error ou chef não existe',
            page_title: 'Error ou página não encontrada',
          },
        })
      }

      return cb(results.rows[0])
    })
  },

  recipesChef(id, res, params, cb) {
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

    db.query(query, [id, limit, offset], (err, results) => {
      if (err || !results.rows) {
        return res.render('_partials/not-found', {
          info: {
            msg: 'Error ao listar receitas do chef',
            page_title: 'Error ou página não encontrada',
          },
        })
      }

      return cb(results.rows)
    })
  },

  update(data, res, cb) {
    const query = `UPDATE chefs SET name=($1), avatar_url=($2) WHERE id=$3`

    const { name, avatar_url, id } = data

    const values = [name, avatar_url, id]

    db.query(query, values, (err) => {
      if (err) {
        return res.render('_partials/not-found', {
          info: {
            msg: 'Error ao atulizar chef',
            page_title: 'Error ou página não encontrada',
          },
        })
      }

      return cb()
    })
  },

  destroy(id, res, cb) {
    const query = `DELETE FROM chefs WHERE id = $1`

    const values = [id]

    db.query(query, values, (err) => {
      if (err) {
        return res.render('_partials/not-found', {
          info: {
            msg: 'Error ao excluir chef',
            page_title: 'Error ou página não encontrada',
          },
        })
      }
      return cb()
    })
  },
}
