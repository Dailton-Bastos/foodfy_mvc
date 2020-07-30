const User = require('../../models/User')

module.exports = {
  index(req, res) {
    const { name } = req.session.user

    const info = {
      page_title: `Foodfy | ${name}`,
      content_title: `Olá, ${name}`,
    }
    return res.render('admin/profile/index', { info })
  },

  async update(req, res) {
    try {
      const { id } = req.session.user

      const { name, email } = req.body

      await User.update(id, { name, email })

      req.flash('success', 'Perfil atualizado, faça login novamente.')

      return res.redirect('/admin/profile')
    } catch (error) {
      req.flash('error', 'Algum erro aconteceu, tente novamente!')
      res.redirect('/admin/profile')
      throw new Error(error)
    }
  },
}
