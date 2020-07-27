const { Router } = require('express')

const routes = new Router()

const SessionController = require('../app/controllers/SessionController')
const Validator = require('../app/validators/auth')

// Auth Session
routes.get('/signin', SessionController.create)
routes.post('/signin', Validator.signin, SessionController.login)

module.exports = routes
