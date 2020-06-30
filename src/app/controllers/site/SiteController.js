const { mostAccessed, all, find, search } = require('../../models/Recipe')
const {
  all: allChefs,
  find: findChef,
  recipesChef,
} = require('../../models/Chef')

const { paginate } = require('../../../libs/utils')

module.exports = {
  index(req, res) {
    const info = {
      page_title: 'Foodfy | Home',
    }

    const about = {
      title: 'As melhores receitas',
      description:
        'Aprenda a construir os melhores pratos com receitas criadas por profissionais do mundo inteiro',
    }

    mostAccessed(res, (recipes) => {
      return res.render('site/index', { about, info, recipes })
    })
  },

  recipes(req, res) {
    const info = {
      page_title: 'Foodfy | Recipes',
    }

    const { page } = req.query

    const params = paginate(page, 6)

    all(res, params, (allRecipes) => {
      const total = allRecipes[0]
        ? Math.ceil(allRecipes[0].total / params.limit)
        : 0

      const pagination = {
        total,
        page: params.page,
      }
      return res.render('site/recipes/index', { info, allRecipes, pagination })
    })
  },

  showRecipe(req, res) {
    const { id } = req.params

    find(id, res, (recipe) => {
      const info = {
        page_title: `${recipe.title}`,
      }

      return res.render('site/recipes/show', { info, recipe })
    })
  },

  searchRecipe(req, res) {
    const { page, filter } = req.query

    const params = paginate(page, 3)

    params.filter = filter

    const info = {
      page_title: `Buscando por ${filter}`,
    }

    search(res, params, (recipes) => {
      const total = recipes[0] ? Math.ceil(recipes[0].total / params.limit) : 0

      const pagination = {
        total,
        page: params.page,
        filter: params.filter,
      }
      return res.render('site/search', { info, recipes, pagination, filter })
    })
  },

  about(req, res) {
    const info = {
      page_title: 'Foodfy | About',
    }

    const about = {
      title: 'Sobre o Foodfy',
    }

    const start = {
      title: 'Como tudo começou',
    }

    const recipes = {
      title: 'Nossas receitas',
    }

    return res.render('site/about', { info, about, start, recipes })
  },

  chefs(req, res) {
    const info = {
      page_title: 'Foodfy | Chefs',
    }

    const { page } = req.query

    const params = paginate(page, 8)

    allChefs(res, params, (listChef) => {
      const total = listChef[0]
        ? Math.ceil(listChef[0].total / params.limit)
        : 0

      const pagination = {
        total,
        page: params.page,
      }
      return res.render('site/chefs/index', { info, listChef, pagination })
    })
  },

  showChef(req, res) {
    const { id } = req.params
    const { page } = req.query

    const params = paginate(page, 4)

    findChef(id, res, (chef) => {
      recipesChef(id, res, params, (recipes) => {
        const info = {
          page_title: `Chef | ${chef.name}`,
        }

        const total = recipes[0]
          ? Math.ceil(recipes[0].total / params.limit)
          : 0

        const pagination = {
          total,
          page: params.page,
        }

        return res.render('site/chefs/show', {
          info,
          chef,
          recipes,
          pagination,
        })
      })
    })
  },
}
