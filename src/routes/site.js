const { Router } = require('express')

const routes = new Router()

const SiteController = require('../app/controllers/site/SiteController')

// Site
routes.get('/recipes', SiteController.recipes)
routes.get('/about', SiteController.about)
routes.get('/chefs', SiteController.chefs)
routes.get('/chefs/:id', SiteController.showChef)
routes.get('/recipes/:id', SiteController.showRecipe)

module.exports = routes
