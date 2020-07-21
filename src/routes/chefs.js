const { Router } = require('express')

const routes = new Router()

const multer = require('../app/middlewares/multer')

const ChefsController = require('../app/controllers/admin/ChefsController')

// Admin Chefs
routes.get('/', ChefsController.index)
routes.get('/new', ChefsController.create)
routes.get('/:id', ChefsController.show)
routes.get('/:id/edit', ChefsController.edit)

routes.post('/', multer.single('file'), ChefsController.post)
routes.put('/:id', multer.single('file'), ChefsController.put)
routes.delete('/:id', ChefsController.delete)

module.exports = routes
