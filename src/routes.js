const { Router } = require('express')

const routes = new Router()

const SiteController = require('./app/controllers/site/SiteController')
const RecipesController = require('./app/controllers/admin/RecipesController')

routes.get('/', SiteController.index)
routes.get('/app/recipes', SiteController.recipes)
routes.get('/app/about', SiteController.about)
routes.get('/app/search', SiteController.search)
routes.get('/app/chefs', SiteController.chefs)
routes.get('/app/recipes/:id', SiteController.showRecipe)

// Admin
routes.get('/admin/recipes', RecipesController.index)
routes.get('/admin/recipes/new', RecipesController.new)
routes.get('/admin/recipes/:id', RecipesController.show)
routes.get('/admin/recipes/:id/edit', RecipesController.edit)

module.exports = routes
