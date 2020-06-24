const { Router } = require('express')

const routes = new Router()

const SiteController = require('./app/controllers/site/SiteController')

routes.get('/', SiteController.index)
routes.get('/app/recipes', SiteController.recipes)
routes.get('/app/about', SiteController.about)
routes.get('/app/search', SiteController.search)
routes.get('/app/chefs', SiteController.chefs)
routes.get('/app/recipes/:id', SiteController.showRecipe)

module.exports = routes
