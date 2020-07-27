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

module.exports = {
  signin,
}
