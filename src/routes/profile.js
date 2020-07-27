const { Router } = require('express')

const routes = new Router()

const ProfileController = require('../app/controllers/admin/ProfileController')

// User Profile
routes.get('/', ProfileController.index)

module.exports = routes
