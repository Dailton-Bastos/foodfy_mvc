const Chefs = require('../models/Chef')

function checkAllFields(body) {
  const keys = Object.keys(body)

  return keys.every((key) => body[key] === '' && key !== 'file')
}

function post(req, res, next) {
  const filledFields = checkAllFields(req.body)

  if (filledFields) {
    req.flash('error', 'Por favor preencha todos os campos!')
    return res.redirect('/admin/chefs/new')
  }

  return next()
}

async function view(req, res, next) {
  const { id } = req.params

  const chef = await Chefs.findByPk(id)

  if (!chef) {
    req.flash('error', 'Página não encontrada!')
    return res.redirect('/not-found')
  }

  req.chef = chef

  return next()
}

async function update(req, res, next) {
  const filledFields = checkAllFields(req.body)

  if (filledFields) {
    req.flash('error', 'Por favor preencha todos os campos!')
    return res.redirect('/admin/chefs/new')
  }

  return next()
}

async function destroy(req, res, next) {
  const { id } = req.params

  const results = await Chefs.recipeFindOne(id)

  const recipe = results.rows[0]

  if (recipe) {
    req.flash('error', 'Chef possui receitas!')
    return res.redirect('/admin/chefs')
  }

  const chef = await Chefs.findByPk(id)

  if (!chef) {
    req.flash('error', 'Chef não encontrado!')
    return res.redirect('/admin/chefs')
  }

  req.chef = chef

  return next()
}

module.exports = {
  post,
  view,
  update,
  destroy,
}
