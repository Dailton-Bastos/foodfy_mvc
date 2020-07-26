const nodemailer = require('nodemailer')
const exphbs = require('express-handlebars')
const nodemailerhbs = require('nodemailer-express-handlebars')
const { resolve } = require('path')
const mailConfig = require('../config/mailer')

const { host, port, secure, auth } = mailConfig

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: auth.user ? auth : null,
})

const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails')

transporter.use(
  'compile',
  nodemailerhbs({
    viewEngine: exphbs.create({
      layoutsDir: resolve(viewPath, 'layouts'),
      partialsDir: resolve(viewPath, 'partials'),
      defaultLayout: 'default',
      extname: '.hbs',
    }),
    viewPath,
    extName: '.hbs',
  })
)

module.exports = {
  sendMail(message) {
    return transporter.sendMail({
      ...mailConfig.default,
      ...message,
    })
  },
}
