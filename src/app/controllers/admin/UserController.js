const { randomBytes } = require('crypto')

const User = require('../../models/User')

module.exports = {
  index(req, res) {
    const info = {
      page_title: 'Foodfy | Gerenciar usuários',
      content_title: 'Gerenciar usuários',
    }

    return res.render('admin/users/index', { info })
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
}
