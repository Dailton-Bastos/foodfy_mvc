const express = require('express')
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const { resolve } = require('path')
const session = require('./config/session')
const routes = require('./routes')

const isDev = process.env.NODE_ENV !== 'production'
const PORT = process.env.NODE_PORT || 3333

// Config Server
const server = express()

server.use(express.urlencoded({ extended: true }))
server.use(express.static(resolve(__dirname, '..', 'public')))
server.use(methodOverride('_method', { methods: ['POST', 'GET'] }))
server.use(flash())
server.use(session)

// Config Views
server.set('view engine', 'njk')
nunjucks.configure(resolve(__dirname, 'app', 'views'), {
  watch: isDev,
  express: server,
  noCache: true,
  autoescape: false,
})

// Config Routes
server.use(routes)

server.listen(PORT)
