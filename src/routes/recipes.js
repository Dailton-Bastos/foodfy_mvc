const { Router } = require('express')

const routes = new Router()

const multer = require('../app/middlewares/multer')

const RecipesController = require('../app/controllers/admin/RecipesController')
const { post, view, update } = require('../app/validators/recipe')

// Admin Recipes
routes.get('/', RecipesController.index)
routes.get('/new', RecipesController.create)

routes.post('/', multer.array('files', 5), post, RecipesController.post)

routes.get('/:id', view, RecipesController.show)
routes.get('/:id/edit', view, RecipesController.edit)
routes.put('/:id', multer.array('files', 5), update, RecipesController.put)
routes.delete('/:id', RecipesController.delete)

module.exports = routes
