const { randomBytes } = require('crypto')
const { hash } = require('bcryptjs')

const User = require('../models/User')

const ResetPasswordMail = require('../jobs/ResetPasswordMail')

const Queue = require('../../libs/Queue')

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

    req.flash('success', `${name} autenticado(a).`)

    return res.redirect('/admin/profile')
  },

  logout(req, res) {
    req.session.destroy(() => {
      res.clearCookie('root')
      return res.redirect('/')
    })
  },

  formResetPassword(req, res) {
    const info = {
      page_title: 'Foodfy | Esqueci minha senha',
    }
    return res.render('auth/password_reset', { info })
  },

  async resetPassword(req, res) {
    const { id, name, email } = req.user

    try {
      const token = randomBytes(20).toString('hex')

      // Token expires in 1 hour
      const currentHour = new Date()
      const tokenExpires = currentHour.setHours(currentHour.getHours() + 1)

      await User.update(id, {
        reset_token: token,
        reset_token_expires: tokenExpires,
      })

      // Send email with token to reset password
      const user = { name, email, token }
      await Queue.add(ResetPasswordMail.key, user)

      req.flash('success', 'Verifique seu email para continuar.')

      return res.redirect('/signin')
    } catch (error) {
      req.flash('error', 'Error inesperado, tente novamente!')
      return res.redirect('/reset-password')
    }
  },

  formNewPassword(req, res) {
    const { token } = req.query

    const info = {
      page_title: 'Foodfy | Nova senha',
    }
    return res.render('auth/new_password', { info, token })
  },

  async newPassword(req, res) {
    const { id } = req.user

    const { password } = req.body

    try {
      const newPassword = await hash(password, 8)

      await User.update(id, {
        password: newPassword,
        reset_token: '',
        reset_token_expires: '',
      })

      req.flash('success', 'Senha atualizada, faça seu login.')

      return res.redirect('/signin')
    } catch (error) {
      req.flash('error', 'Error inesperado, tente novamente!')
      return res.redirect('/reset-password')
    }
  },
}
