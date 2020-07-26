const { Router } = require('express')

const routes = new Router()

const SiteController = require('../app/controllers/site/SiteController')
const SearchController = require('../app/controllers/SearchController')

const site = require('./site')
const recipes = require('./recipes')
const chefs = require('./chefs')
const users = require('./users')

// Flash Messages
routes.use((req, res, next) => {
  res.locals.messageSuccess = req.flash('success')
  res.locals.messageError = req.flash('error')
  return next()
})

// Site
routes.get('/', SiteController.index)
routes.get('/search', SearchController.index)

routes.use('/app', site)
routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)
routes.use('/admin/users', users)

routes.use((req, res) => {
  req.flash('error', 'Algo deu errado!')
  return res.status(404).render('_partials/not-found', {
    info: {
      msg: 'Página não encontrada, ou algo deu errado',
      page_title: 'Página não encontrada',
    },
  })
})

module.exports = routes
