const { compare } = require('bcryptjs')
const User = require('../models/User')

async function signin(req, res, next) {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email } })

  if (!user) {
    req.flash('error', 'Usuário não encontrado!')
    return res.redirect('/signin')
  }

  const checkUser = await compare(password, user.password)

  if (!checkUser) {
    req.flash('error', 'Senha incorreta!')
    return res.redirect('/signin')
  }

  req.user = user

  return next()
}

async function resetPassword(req, res, next) {
  const { email } = req.body

  const user = await User.findOne({ where: { email } })

  if (!user) {
    req.flash('error', 'Email não cadastrado!')
    return res.redirect('/reset-password')
  }

  req.user = user

  return next()
}

async function newPassword(req, res, next) {
  const { email, password, passwordConfirm, token } = req.body

  const user = await User.findOne({ where: { reset_token: token } })

  const { reset_token_expires } = user

  let now = new Date()
  now = now.setHours(now.getHours())

  if (!reset_token_expires) {
    req.flash('error', 'Token inválido, solicite nova recuperação de senha!')
    return res.redirect('/reset-password')
  }

  if (now > reset_token_expires) {
    req.flash('error', 'Token expirado, solicite nova recuperação de senha!')
    return res.redirect('/reset-password')
  }

  if (email !== user.email) {
    req.flash('error', 'Email digitado não é cadastrado!')
    return res.redirect('/reset-password')
  }

  if (passwordConfirm !== password) {
    req.flash('error', 'A senha e a confirmação de senha estão incorretas!')
    return res.redirect('/reset-password')
  }

  req.user = user

  return next()
}

module.exports = {
  signin,
  resetPassword,
  newPassword,
}
