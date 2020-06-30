const {
  all,
  create,
  selectChef,
  find,
  update,
  destroy,
} = require('../../models/Recipe')

const { paginate } = require('../../../libs/utils')

module.exports = {
  index(req, res) {
    const info = {
      page_title: 'Foodfy | Gerenciar receitas',
      content_title: 'Gerenciar receitas',
    }

    const { page } = req.query

    const params = paginate(page, 6)

    all(res, params, (recipes) => {
      const total = recipes[0] ? Math.ceil(recipes[0].total / params.limit) : 0

      const pagination = {
        total,
        page: params.page,
      }

      return res.render('admin/recipes/index', { info, recipes, pagination })
    })
  },

  newRecipe(req, res) {
    const info = {
      page_title: 'Foodfy | Nova receita',
      content_title: 'Criando receita',
    }

    selectChef(res, (chefs) => {
      return res.render('admin/recipes/new', { info, chefs })
    })
  },

  post(req, res) {
    const keys = Object.keys(req.body)
    const isValid = keys.every((key) => req.body[key] !== '')

    if (!isValid) res.send('Todos os campos são obrigatório')

    create(req.body, res, (recipe) => {
      return res.redirect(`/admin/recipes/${recipe.id}`)
    })
  },

  show(req, res) {
    const { id } = req.params

    find(id, res, (recipe) => {
      const info = {
        page_title: `Foodfy | ${recipe.title}`,
        content_title: `Receita: ${recipe.title}`,
      }

      return res.render('admin/recipes/show', { info, recipe })
    })
  },

  edit(req, res) {
    const { id } = req.params
    find(id, res, (recipe) => {
      selectChef(res, (chefs) => {
        const info = {
          page_title: `Editando | ${recipe.title}`,
          content_title: 'Editando receita',
        }

        return res.render('admin/recipes/edit', { info, id, recipe, chefs })
      })
    })
  },

  put(req, res) {
    const { id } = req.body

    const keys = Object.keys(req.body)
    const isValid = keys.every((key) => req.body[key] !== '')

    if (!isValid) res.send('Todos os campos são obrigatório')

    update(req.body, res, () => {
      return res.redirect(`/admin/recipes/${id}`)
    })
  },

  deleteRecipe(req, res) {
    const { id } = req.params

    destroy(id, res, () => res.redirect(`/admin/recipes`))
  },
}
