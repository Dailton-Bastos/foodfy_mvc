const Recipe = require('../models/Recipe')

function checkAllFields(body) {
  const keys = Object.keys(body)
  const inputs = {
    files: 'removed_files',
    info: 'information',
  }

  const fieldFilled = keys.every(
    (key) => body[key] !== '' || key === inputs.files || key === inputs.info
  )

  return !fieldFilled
}

async function post(req, res, next) {
  const filledFields = checkAllFields(req.body)

  if (filledFields) {
    req.flash('error', 'Por favor preencha todos os campos!')
    return res.redirect('/admin/recipes/new')
  }

  if (req.files.length === 0) {
    req.flash('error', 'Por favor envie ao menos uma foto!')
    return res.redirect('/admin/recipes/new')
  }

  if (req.files.length > 5) {
    req.flash('error', 'Limite máximo de 5 fotos!')
    return res.redirect('/admin/recipes/new')
  }

  return next()
}

async function view(req, res, next) {
  const { id } = req.params

  const { id: userId, is_admin } = req.session.user

  const recipe = await Recipe.findByPk(id)

  if (!recipe) {
    req.flash('error', 'Receita não encontrada!')
    return res.redirect('/admin/recipes')
  }

  if (!is_admin) {
    if (recipe.user_id !== userId) {
      req.flash('error', 'Receita não encontrada!')
      return res.redirect('/admin/recipes')
    }
  }

  req.recipe = recipe

  return next()
}

async function update(req, res, next) {
  const { id, removed_files } = req.body

  const recipe = await Recipe.findByPk(id)

  const { total_files } = recipe

  const filledFields = checkAllFields(req.body)

  if (filledFields) {
    req.flash('error', 'Por favor preencha todos os campos!')
    return res.redirect('/admin/recipes/new')
  }

  if (+total_files === 0 && req.files.length === 0) {
    req.flash('error', 'Por favor envie ao menos uma foto!')
    return res.redirect(`/admin/recipes/${id}/edit`)
  }

  if (removed_files && req.files.length === 0) {
    const removedFiles = removed_files.split(',')
    const totalRemoveFiles = removedFiles.length - 1

    if (totalRemoveFiles >= +total_files) {
      req.flash('error', 'Por favor envie ao menos uma foto!')
      return res.redirect(`/admin/recipes/${id}/edit`)
    }
  }

  if (req.files.length > 5) {
    req.flash('error', 'Limite máximo de 5 fotos!')
    return res.redirect(`/admin/recipes/${id}/edit`)
  }

  return next()
}

module.exports = {
  post,
  view,
  update,
}
