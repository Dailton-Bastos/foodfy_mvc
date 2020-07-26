const { Router } = require('express')

const routes = new Router()

const UserController = require('../app/controllers/admin/UserController')

const Vaildator = require('../app/validators/user')

// Admin Users
routes.get('/', UserController.index)
routes.get('/new', UserController.create)
routes.get('/:id/edit', Vaildator.edit, UserController.edit)

routes.post('/', Vaildator.post, UserController.post)
routes.put('/:id', Vaildator.update, UserController.update)
routes.delete('/:id', UserController.delete)

module.exports = routes
