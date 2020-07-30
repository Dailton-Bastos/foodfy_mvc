const { compare } = require('bcryptjs')
const User = require('../models/User')

const { checkAllFields } = require('../../libs/utils')

async function update(req, res, next) {
  const filledFields = checkAllFields(req.body)

  if (filledFields) {
    req.flash('error', 'Por favor preencha todos os campos!')
    return res.redirect('/admin/profile')
  }

  const { email, password } = req.body

  const { id } = req.session.user

  const user = await User.findByPk(id)

  const passed = await compare(password, user.password)

  if (!passed) {
    req.flash('error', 'Senha incorreta, tente novamente!')
    return res.redirect('/admin/profile')
  }

  if (email !== user.email) {
    const userExists = await User.findOne({ where: { email } })

    if (userExists) {
      req.flash('error', 'Email já cadastrado no sistema!')
      return res.redirect('/admin/profile')
    }
  }

  return next()
}

module.exports = { update }
