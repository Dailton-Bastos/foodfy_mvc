const { Router } = require('express')

const routes = new Router()

const ProfileController = require('../app/controllers/admin/ProfileController')
const Validator = require('../app/validators/profile')

// User Profile
routes.get('/', ProfileController.index)
routes.put('/:id', Validator.update, ProfileController.update)

module.exports = routes
