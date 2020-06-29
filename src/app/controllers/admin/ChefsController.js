const {
  all,
  create,
  find,
  update,
  destroy,
  recipesChef,
} = require('../../models/Chef')

const { paginate } = require('../../../libs/utils')

module.exports = {
  index(req, res) {
    const info = {
      page_title: 'Foodfy | Gerenciar chefs',
      content_title: 'Gerenciar chefs',
    }

    const { page } = req.query

    const params = paginate(page, 8)

    all(res, params, (chefs) => {
      const total = chefs[0] ? Math.ceil(chefs[0].total / params.limit) : 0

      const pagination = {
        total,
        page: params.page,
      }

      return res.render('admin/chefs/index', { info, chefs, pagination })
    })
  },

  newChef(req, res) {
    const info = {
      page_title: 'Foodfy | Novo chef',
      content_title: 'Criando chef',
    }
    return res.render('admin/chefs/new', { info })
  },

  post(req, res) {
    const keys = Object.keys(req.body)
    const isValid = keys.every((key) => req.body[key] !== '')

    if (!isValid) res.send('Todos os campos são obrigatório')

    create(req.body, res, (chef) => {
      return res.redirect(`/admin/chefs/${chef.id}`)
    })
  },

  show(req, res) {
    const { id } = req.params
    const { page } = req.query

    const params = paginate(page, 4)

    find(id, res, (chef) => {
      recipesChef(id, res, params, (recipes) => {
        const info = {
          page_title: `Chef | ${chef.name}`,
          content_title: `Chef: ${chef.name}`,
        }

        const total = recipes[0]
          ? Math.ceil(recipes[0].total / params.limit)
          : 0

        const pagination = {
          total,
          page: params.page,
        }

        return res.render('admin/chefs/show', {
          info,
          chef,
          recipes,
          pagination,
        })
      })
    })
  },

  edit(req, res) {
    const { id } = req.params

    find(id, res, (chef) => {
      const info = {
        page_title: `Editando | ${chef.name}`,
        content_title: 'Editando chef',
      }
      return res.render('admin/chefs/edit', { info, id, chef })
    })
  },

  put(req, res) {
    const { id } = req.body

    const keys = Object.keys(req.body)
    const isValid = keys.every((key) => req.body[key] !== '')

    if (!isValid) res.send('Todos os campos são obrigatório')

    update(req.body, res, () => {
      return res.redirect(`/admin/chefs/${id}`)
    })
  },

  deleteChef(req, res) {
    const { id } = req.params

    const params = paginate(1, 1)

    recipesChef(id, res, params, (recipes) => {
      if (!recipes[0]) {
        return destroy(id, res, () => res.redirect(`/admin/chefs`))
      }

      return res.send('Chefs que possuem receitas não podem ser deletados')
    })
  },
}
