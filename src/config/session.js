const session = require('express-session')
const PgSession = require('connect-pg-simple')(session)
const db = require('./database')

module.exports = session({
  name: 'root',
  secret: 'MyAppSecret',
  resave: false,
  saveUninitialized: false,
  store: new PgSession({ pool: db }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
})
