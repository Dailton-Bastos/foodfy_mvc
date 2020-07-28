const { Router } = require('express')

const routes = new Router()

const SessionController = require('../app/controllers/SessionController')
const Validator = require('../app/validators/auth')

const guestMiddleware = require('../app/middlewares/guest')

// Auth Session
routes.get('/signin', guestMiddleware, SessionController.create)
routes.post('/signin', Validator.signin, SessionController.login)
routes.post('/logout', SessionController.logout)

module.exports = routes
