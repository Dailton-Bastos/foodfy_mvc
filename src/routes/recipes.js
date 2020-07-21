const { Router } = require('express')

const routes = new Router()

const multer = require('../app/middlewares/multer')

const RecipesController = require('../app/controllers/admin/RecipesController')

// Admin Recipes
routes.get('/', RecipesController.index)
routes.get('/new', RecipesController.create)
routes.get('/:id', RecipesController.show)
routes.get('/:id/edit', RecipesController.edit)

routes.post('/', multer.array('files', 5), RecipesController.post)
routes.put('/:id', multer.array('files', 5), RecipesController.put)
routes.delete('/:id', RecipesController.delete)

module.exports = routes
