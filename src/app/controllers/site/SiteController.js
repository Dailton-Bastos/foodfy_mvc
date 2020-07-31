const Recipes = require('../../models/Recipe')
const Chefs = require('../../models/Chef')

const { pageLimit, paginate, getImageURL } = require('../../../libs/utils')

module.exports = {
  async index(req, res) {
    const info = {
      page_title: 'Foodfy | Home',
    }

    const about = {
      title: 'As melhores receitas',
      description:
        'Aprenda a construir os melhores pratos com receitas criadas por profissionais do mundo inteiro',
    }

    async function getImage(recipeId) {
      const results = await Recipes.files(recipeId)

      const files = results.rows.map((file) => {
        return getImageURL(file, req)
      })

      return files[0]
    }

    try {
      const results = await Recipes.mostAccessed()
      const recipes = results.rows

      const recipesPromise = recipes.map(async (recipe) => {
        recipe.image = await getImage(recipe.id)
        return recipe
      })

      const recipesMostAccessed = await Promise.all(recipesPromise)

      return res.render('site/index', {
        about,
        info,
        recipes: recipesMostAccessed,
      })
    } catch (error) {
      req.flash('error', 'Error inesperado, tente novamente.')
      res.redirect('/')
      throw new Error(error)
    }
  },

  async recipes(req, res) {
    const info = {
      page_title: 'Foodfy | Recipes',
    }

    const { page } = req.query

    const params = pageLimit(page, 6)

    async function getImage(recipeId) {
      const results = await Recipes.files(recipeId)

      const files = results.rows.map((file) => {
        return getImageURL(file, req)
      })

      return files[0]
    }

    try {
      const results = await Recipes.findAll(params)

      const recipes = results.rows

      const pagination = paginate(recipes, params)

      const recipesPromise = recipes.map(async (recipe) => {
        recipe.image = await getImage(recipe.id)
        return recipe
      })

      const allRecipes = await Promise.all(recipesPromise)

      return res.render('site/recipes/index', { info, allRecipes, pagination })
    } catch (error) {
      req.flash('error', 'Error inesperado, tente novamente.')
      res.redirect('/')
      throw new Error(error)
    }
  },

  async showRecipe(req, res) {
    const { id } = req.params

    try {
      const recipe = await Recipes.findByPk(id)

      if (!recipe) {
        req.flash('error', 'Página não encontrada!')
        return res.redirect('/not-found')
      }

      const info = {
        page_title: `${recipe.title}`,
      }

      const results = await Recipes.files(id)
      const files = results.rows.map((file) => ({
        ...file,
        src: getImageURL(file, req),
      }))

      return res.render('site/recipes/show', { info, recipe, files })
    } catch (error) {
      req.flash('error', 'Error inesperado, tente novamente.')
      res.redirect('/')
      throw new Error(error)
    }
  },

  async chefs(req, res) {
    async function getAvatar(avatarId) {
      const results = await Chefs.avatar(avatarId)

      const files = results.rows.map((file) => {
        return getImageURL(file, req)
      })

      return files[0]
    }
    const info = {
      page_title: 'Foodfy | Chefs',
    }

    const { page } = req.query

    const params = pageLimit(page, 8)

    try {
      const results = await Chefs.all(params)

      const chefs = results.rows

      const pagination = paginate(chefs, params)

      const chefsPromise = chefs.map(async (chef) => {
        const { file_id } = chef
        chef.avatar = await getAvatar(file_id)

        return chef
      })

      const allChefs = await Promise.all(chefsPromise)

      return res.render('site/chefs/index', { info, allChefs, pagination })
    } catch (error) {
      req.flash('error', 'Error inesperado, tente novamente.')
      res.redirect('/')
      throw new Error(error)
    }
  },

  async showChef(req, res) {
    const { id } = req.params
    const { page } = req.query

    async function getRecipeImage(recipeId) {
      const results = await Recipes.files(recipeId)

      const files = results.rows.map((file) => {
        return getImageURL(file, req)
      })

      return files[0]
    }

    try {
      const chef = await Chefs.findByPk(id)

      if (!chef) {
        req.flash('error', 'Página não encontrada!')
        return res.redirect('/not-found')
      }

      const info = {
        page_title: `Chef | ${chef.name}`,
      }

      const { file_id } = chef

      let results = await Chefs.avatar(file_id)

      const file = results.rows[0]

      let avatar = {}

      if (file) avatar = { ...file, src: getImageURL(file, req) }

      const params = pageLimit(page, 4)

      results = await Chefs.recipes(id, params)

      const recipes = results.rows

      const pagination = paginate(recipes, params)

      const recipesPromise = recipes.map(async (recipe) => {
        recipe.img = await getRecipeImage(recipe.id)
        return recipe
      })

      const recipesIndex = await Promise.all(recipesPromise)

      return res.render('site/chefs/show', {
        info,
        chef,
        avatar,
        recipes: recipesIndex,
        pagination,
      })
    } catch (error) {
      req.flash('error', 'Error inesperado, tente novamente.')
      res.redirect('/')
      throw new Error(error)
    }
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
}
