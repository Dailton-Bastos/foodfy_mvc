const Recipes = require('../models/Recipe')
const { pageLimit, paginate, getImageURL } = require('../../libs/utils')

module.exports = {
  async index(req, res) {
    async function getImage(recipeId) {
      const results = await Recipes.files(recipeId)

      const files = results.rows.map((file) => {
        return getImageURL(file, req)
      })

      return files[0]
    }

    const { page, filter } = req.query
    const params = pageLimit(page, 3)
    params.filter = filter

    const info = {
      page_title: `Buscando por ${filter}`,
    }

    try {
      const results = await Recipes.search(params)
      let recipes = results.rows

      const recipesPromise = recipes.map(async (recipe) => {
        recipe.image = await getImage(recipe.id)
        return recipe
      })

      recipes = await Promise.all(recipesPromise)

      const pagination = paginate(recipes, params)
      pagination.page = params.page
      pagination.filter = params.filter

      return res.render('site/search', { info, recipes, pagination, filter })
    } catch (error) {
      throw new Error(error)
    }
  },
}
