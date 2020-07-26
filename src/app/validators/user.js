const User = require('../models/User')

function checkAllFields(body) {
  const keys = Object.keys(body)

  return !keys.every((key) => body[key] !== '' || key === 'is_admin')
}

async function post(req, res, next) {
  const filledFields = checkAllFields(req.body)

  if (filledFields) {
    req.flash('error', 'Por favor preencha todos os campos!')
    return res.redirect('/admin/users/new')
  }

  const { email } = req.body

  const user = await User.findOne({ where: { email } })

  if (user) {
    req.flash('error', 'Usuário ou email já cadastrado!')
    return res.redirect('/admin/users/new')
  }

  return next()
}

async function edit(req, res, next) {
  const { id } = req.params

  const user = await User.findOne({ where: { id } })

  if (!user) {
    req.flash('error', 'Usuário não encontrado!')
    return res.redirect('/admin/users')
  }
  req.user = user

  return next()
}

async function update(req, res, next) {
  const filledFields = checkAllFields(req.body)

  const { id, email } = req.body

  if (filledFields) {
    req.flash('error', 'Por favor preencha todos os campos!')
    return res.redirect(`/admin/users/${id}/edit`)
  }

  const user = await User.findByPk(id)

  if (!user) {
    req.flash('error', 'Usuário não encontrado!')
    return res.redirect('/admin/users/index')
  }

  if (email && email !== user.email) {
    const userExists = await User.findOne({ where: { email } })

    if (userExists) {
      req.flash('error', 'Email já cadastrado no sistema!')
      return res.redirect(`/admin/users/${id}/edit`)
    }
  }

  req.user = user

  return next()
}

module.exports = {
  post,
  update,
  edit,
}
