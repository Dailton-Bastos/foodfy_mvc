const { Router } = require('express')

const routes = new Router()

const SiteController = require('../app/controllers/site/SiteController')
const SearchController = require('../app/controllers/SearchController')

const authMiddleware = require('../app/middlewares/auth')
const adminMiddleware = require('../app/middlewares/admin')
const siteMiddleware = require('../app/middlewares/site')

const site = require('./site')
const recipes = require('./recipes')
const chefs = require('./chefs')
const users = require('./users')
const profile = require('./profile')
const auth = require('./auth')

// Flash Messages
routes.use((req, res, next) => {
  res.locals.messageSuccess = req.flash('success')
  res.locals.messageError = req.flash('error')
  return next()
})

// Site
routes.get('/', siteMiddleware, SiteController.index)
routes.get('/search', SearchController.index)

routes.use('/app', siteMiddleware, site)

routes.use('/admin', authMiddleware)

routes.use('/admin/profile', profile)
routes.use('/', auth)

routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', adminMiddleware, chefs)
routes.use('/admin/users', adminMiddleware, users)

routes.use('/not-found', (req, res) => {
  return res.render('_partials/not-found', {
    info: {
      page_title: 'Página não encontrada',
      msg: 'Página não encontrada, ou algo deu errado.',
    },
  })
})

routes.use((req, res) => {
  return res.redirect('/not-found')
})

module.exports = routes
