const { create, find, update, destroy, paginate } = require('../../models/Chef')

module.exports = {
  index(req, res) {
    const info = {
      page_title: 'Foodfy | Gerenciar chefs',
      content_title: 'Gerenciar chefs',
    }

    let { page, limit } = req.query

    page = page || 1
    limit = Number(limit || 4)
    const offset = limit * (page - 1)

    const params = {
      page,
      limit,
      offset,
      cb(chefs) {
        const pagination = {
          total: Math.ceil(chefs[0].total / limit),
          page,
        }
        return res.render('admin/chefs/index', { info, chefs, pagination })
      },
    }

    paginate(params)
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

    find(id, res, (chef) => {
      const info = {
        page_title: `Chef | ${chef.name}`,
        content_title: `Chef: ${chef.name}`,
      }

      return res.render('admin/chefs/show', { info, chef })
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

    destroy(id, res, () => res.redirect(`/admin/chefs`))
  },
}
