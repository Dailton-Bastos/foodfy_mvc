const express = require('express')
const nunjucks = require('nunjucks')
const { resolve } = require('path')
const routes = require('./routes')

const isDev = process.env.NODE_ENV !== 'production'
const PORT = process.env.NODE_PORT || 3333

// Config Server
const server = express()
server.use(express.urlencoded({ extended: true }))
server.use(express.static(resolve(__dirname, '..', 'public')))

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
