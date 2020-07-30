const Recipe = require('../../models/Recipe')
const RecipeFile = require('../../models/RecipeFile')
const File = require('../../models/File')

const { pageLimit, paginate, getImageURL } = require('../../../libs/utils')

module.exports = {
  async index(req, res) {
    const { id, is_admin } = req.session.user

    const info = {
      page_title: 'Foodfy | Gerenciar receitas',
      content_title: 'Gerenciar receitas',
    }

    async function getImage(recipeId) {
      const results = await Recipe.files(recipeId)

      const files = results.rows.map((file) => {
        return getImageURL(file, req)
      })

      return files[0]
    }

    const { page } = req.query

    const params = pageLimit(page, 6)

    if (!is_admin) params.userId = id

    try {
      const results = await Recipe.findAll(params)

      const recipes = results.rows

      const pagination = paginate(recipes, params)

      const recipesPromise = recipes.map(async (recipe) => {
        recipe.img = await getImage(recipe.id)
        return recipe
      })

      const recipesIndex = await Promise.all(recipesPromise)

      return res.render('admin/recipes/index', {
        info,
        recipes: recipesIndex,
        pagination,
      })
    } catch (error) {
      req.flash('error', 'Houve um problema, tente novamente!')
      throw new Error(error)
    }
  },

  async create(req, res) {
    const info = {
      page_title: 'Foodfy | Nova receita',
      content_title: 'Criando receita',
    }

    try {
      const results = await Recipe.allChefs()

      const chefs = results.rows
      return res.render('admin/recipes/new', { info, chefs })
    } catch (error) {
      req.flash('error', 'Houve um problema, tente novamente!')
      throw new Error(error)
    }
  },

  async post(req, res) {
    const { id: user_id } = req.session.user

    const { title, ingredients, preparation, information, chef } = req.body

    try {
      const results = await Recipe.create({
        title,
        ingredients,
        preparation,
        information,
        chef,
        user_id,
      })

      const recipeId = results.rows[0].id

      const recipeImages = req.files.map(async (file) => {
        const image = await File.create(file)
        const fileId = image.rows[0].id
        return RecipeFile.create(recipeId, fileId)
      })
      await Promise.all(recipeImages)

      req.flash('success', 'Receita cadastrada com sucesso.')

      return res.redirect(`/admin/recipes/${recipeId}`)
    } catch (error) {
      req.flash('error', 'Houve um problema, tente novamente!')
      res.redirect('/admin/recipes/new')
      throw new Error(error)
    }
  },

  async show(req, res) {
    const { recipe } = req

    const info = {
      page_title: `Foodfy | ${recipe.title}`,
      content_title: `Receita: ${recipe.title}`,
    }

    try {
      // Images of recipe
      const results = await Recipe.files(recipe.id)
      const files = results.rows.map((file) => ({
        ...file,
        src: getImageURL(file, req),
      }))

      return res.render('admin/recipes/show', { info, recipe, files })
    } catch (error) {
      req.flash('error', 'Houve um problema, tente novamente!')
      throw new Error(error)
    }
  },

  async edit(req, res) {
    const { recipe } = req

    const info = {
      page_title: `Editando | ${recipe.title}`,
      content_title: 'Editando receita',
    }

    try {
      // Get All Chefs
      let results = await Recipe.allChefs()

      const chefs = results.rows

      // Get All Recipe Images
      results = await Recipe.files(recipe.id)
      let files = results.rows

      files = files.map((file) => ({
        ...file,
        src: getImageURL(file, req),
      }))

      return res.render('admin/recipes/edit', {
        info,
        recipe,
        chefs,
        files,
      })
    } catch (error) {
      req.flash('error', 'Houve um problema, tente novamente!')
      throw new Error(error)
    }
  },

  async put(req, res) {
    const { id, removed_files } = req.body

    try {
      await Recipe.update(req.body)

      if (req.files.length !== 0) {
        const newFilesPromise = req.files.map(async (file) => {
          const image = await File.create(file)
          const { id: fileId } = image.rows[0]
          return RecipeFile.create(id, fileId)
        })
        await Promise.all(newFilesPromise)
      }

      if (removed_files) {
        const removedFiles = removed_files.split(',')
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1)

        removedFiles.forEach(async (file) => {
          await File.delete(file)
        })
      }

      req.flash('success', 'Receita atualizada com sucesso!')
      return res.redirect(`/admin/recipes/${id}`)
    } catch (error) {
      req.flash('error', 'Houve um problema, tente novamente!')
      res.redirect(`/admin/recipes/${id}`)
      throw new Error(error)
    }
  },

  async delete(req, res) {
    const { id } = req.params

    try {
      // Get all recipe images
      const results = await Recipe.files(id)
      const files = results.rows

      await Recipe.delete(id)

      if (files.length) {
        try {
          files.forEach(async (file) => File.delete(file.id))
        } catch (error) {
          throw new Error(error)
        }
      }

      req.flash('success', 'Receita deletada com sucesso!')
      return res.redirect(`/admin/recipes`)
    } catch (error) {
      req.flash('error', 'Houve um problema, tente novamente!')
      res.redirect(`/admin/recipes`)
      throw new Error(error)
    }
  },
}
