const User = require('../models/User')

function checkAllFields(body) {
  const keys = Object.keys(body)

  return !keys.every((key) => body[key] !== '' || key === 'is_admin')
}

async function post(req, res, next) {
  const filledFields = checkAllFields(req.body)

  if (filledFields) {
    req.flash('error', 'Por favor preencha todos os campos.')
    return res.redirect('/admin/users/new')
  }

  const { email } = req.body

  const user = await User.findOne({ where: { email } })

  if (user) {
    req.flash('error', 'Usuário ou email já cadastro')
    return res.redirect('/admin/users/new')
  }

  return next()
}

module.exports = {
  post,
}
