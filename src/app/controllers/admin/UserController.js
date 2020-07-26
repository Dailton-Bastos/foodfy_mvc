const { randomBytes } = require('crypto')

const User = require('../../models/User')

const { pageLimit, paginate } = require('../../../libs/utils')

module.exports = {
  async index(req, res) {
    const info = {
      page_title: 'Foodfy | Gerenciar usuários',
      content_title: 'Gerenciar usuários',
    }

    const { page } = req.query

    const params = pageLimit(page, 6)

    try {
      const results = await User.findAll(params)
      const users = results.rows

      const pagination = paginate(users, params)

      return res.render('admin/users/index', { info, users, pagination })
    } catch (error) {
      throw new Error(error)
    }
  },

  create(req, res) {
    const info = {
      page_title: 'Foodfy | Novo usuário',
      content_title: 'Criando usuário',
    }

    return res.render('admin/users/new', { info })
  },

  async post(req, res) {
    const { name, email, is_admin } = req.body

    try {
      const password = randomBytes(5).toString('hex')

      await User.create({
        name,
        email,
        password,
        is_admin,
      })

      req.flash('success', 'Usuário cadastrado com sucesso!')

      return res.redirect('/admin/users')
    } catch (error) {
      throw new Error(error)
    }
  },

  async show(req, res) {
    const { user } = req

    const info = {
      page_title: `Usuário | ${user.name}`,
      content_title: `Usuário: ${user.name}`,
    }

    return res.render('admin/users/show', { user, info })
  },
}
