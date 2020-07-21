const { Router } = require('express')

const routes = new Router()

const SiteController = require('../app/controllers/site/SiteController')
const SearchController = require('../app/controllers/SearchController')

const recipes = require('./recipes')
const chefs = require('./chefs')

// Site
routes.get('/', SiteController.index)
routes.get('/app/recipes', SiteController.recipes)
routes.get('/app/about', SiteController.about)
routes.get('/app/chefs', SiteController.chefs)
routes.get('/app/chefs/:id', SiteController.showChef)
routes.get('/app/recipes/:id', SiteController.showRecipe)
routes.get('/search', SearchController.index)

routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)

routes.use((_, res) => {
  return res.status(404).render('_partials/not-found', {
    info: {
      msg: 'Página não encontrada, ou algo deu errado',
      page_title: 'Página não encontrada',
    },
  })
})

module.exports = routes
