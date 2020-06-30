const { Router } = require('express')

const routes = new Router()

const SiteController = require('./app/controllers/site/SiteController')
const RecipesController = require('./app/controllers/admin/RecipesController')
const ChefsController = require('./app/controllers/admin/ChefsController')

routes.get('/', SiteController.index)
routes.get('/app/recipes', SiteController.recipes)
routes.get('/app/about', SiteController.about)
routes.get('/app/search', SiteController.searchRecipe)
routes.get('/app/chefs', SiteController.chefs)
routes.get('/app/chefs/:id', SiteController.showChef)
routes.get('/app/recipes/:id', SiteController.showRecipe)

// Admin Recipes
routes.get('/admin/recipes', RecipesController.index)
routes.get('/admin/recipes/new', RecipesController.newRecipe)
routes.get('/admin/recipes/:id', RecipesController.show)
routes.get('/admin/recipes/:id/edit', RecipesController.edit)

routes.post('/admin/recipes', RecipesController.post)
routes.put('/admin/recipes/:id', RecipesController.put)
routes.delete('/admin/recipes/:id', RecipesController.deleteRecipe)

// Admin Chefs
routes.get('/admin/chefs', ChefsController.index)
routes.get('/admin/chefs/new', ChefsController.newChef)
routes.get('/admin/chefs/:id', ChefsController.show)
routes.get('/admin/chefs/:id/edit', ChefsController.edit)

routes.post('/admin/chefs', ChefsController.post)
routes.put('/admin/chefs/:id', ChefsController.put)
routes.delete('/admin/chefs/:id', ChefsController.deleteChef)

module.exports = routes
