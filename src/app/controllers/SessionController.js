module.exports = {
  create(req, res) {
    const info = {
      page_title: 'Foodfy | Login',
    }
    return res.render('auth/signin', { info })
  },

  login(req, res) {
    const { name } = req.user
    req.session.user = req.user

    req.flash('success', `${name} autenticado.`)

    return res.redirect('/admin/profile')
  },
}
