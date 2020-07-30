const { Router } = require('express')

const routes = new Router()

const multer = require('../app/middlewares/multer')

const ChefsController = require('../app/controllers/admin/ChefsController')
const Validator = require('../app/validators/chef')

const { post, view, update, destroy } = Validator

// Admin Chefs
routes.get('/', ChefsController.index)
routes.get('/new', ChefsController.create)
routes.get('/:id', view, ChefsController.show)
routes.get('/:id/edit', view, ChefsController.edit)

routes.post('/', multer.single('file'), post, ChefsController.post)
routes.put('/:id', multer.single('file'), update, ChefsController.put)
routes.delete('/:id', destroy, ChefsController.delete)

module.exports = routes
