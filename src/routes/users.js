const { Router } = require('express')

const routes = new Router()

const UserController = require('../app/controllers/admin/UserController')

const Vaildator = require('../app/validators/user')

// Admin Users
routes.get('/', UserController.index)
routes.get('/new', UserController.create)

routes.post('/', Vaildator.post, UserController.post)

module.exports = routes
