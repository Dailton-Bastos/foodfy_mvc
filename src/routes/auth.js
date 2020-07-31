const { Router } = require('express')

const routes = new Router()

const SessionController = require('../app/controllers/SessionController')
const {
  signin,
  resetPassword,
  formNewPassword,
  newPassword,
} = require('../app/validators/auth')

const guestMiddleware = require('../app/middlewares/guest')

// Auth Session
routes.get('/signin', guestMiddleware, SessionController.create)

routes.post('/signin', signin, SessionController.login)
routes.post('/logout', SessionController.logout)

routes.get(
  '/reset-password',
  guestMiddleware,
  SessionController.formResetPassword
)

routes.post('/reset-password', resetPassword, SessionController.resetPassword)

routes.get(
  '/new-password',
  guestMiddleware,
  formNewPassword,
  SessionController.formNewPassword
)
routes.post('/new-password', newPassword, SessionController.newPassword)

module.exports = routes
