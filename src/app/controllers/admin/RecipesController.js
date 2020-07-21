const Recipe = require('../../models/Recipe')
const RecipeFile = require('../../models/RecipeFile')
const File = require('../../models/File')

const { pageLimit, paginate, getImageURL } = require('../../../libs/utils')

module.exports = {
  async index(req, res) {
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

    try {
      const results = await Recipe.all(params)

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
      throw new Error(error)
    }
  },

  async post(req, res) {
    const keys = Object.keys(req.body)

    keys.forEach((key) => {
      const isValid =
        req.body[key] === '' && key !== 'removed_files' && key !== 'information'
      if (isValid) return res.send('All fields required')
      return isValid
    })

    if (req.files.length === 0) return res.send('Envio de foto é obrigatório')

    if (req.files.length > 5) return res.send('Limite máximo de 5 fotos')

    const { title, ingredients, preparation, information, chef } = req.body

    try {
      const results = await Recipe.create({
        title,
        ingredients,
        preparation,
        information,
        chef,
      })

      const recipeId = results.rows[0].id

      const recipeImages = req.files.map(async (file) => {
        const image = await File.create(file)
        const fileId = image.rows[0].id
        return RecipeFile.create(recipeId, fileId)
      })
      await Promise.all(recipeImages)

      return res.redirect(`/admin/recipes/${recipeId}`)
    } catch (error) {
      throw new Error(error)
    }
  },

  async show(req, res) {
    const { id } = req.params

    try {
      let results = await Recipe.find(id)

      const recipe = results.rows[0]

      if (!recipe) return res.send('Recipe not found')

      const info = {
        page_title: `Foodfy | ${recipe.title}`,
        content_title: `Receita: ${recipe.title}`,
      }

      // Images of recipe
      results = await Recipe.files(id)
      const files = results.rows.map((file) => ({
        ...file,
        src: getImageURL(file, req),
      }))

      return res.render('admin/recipes/show', { info, recipe, files })
    } catch (error) {
      throw new Error(error)
    }
  },

  async edit(req, res) {
    const { id } = req.params

    try {
      let results = await Recipe.find(id)

      const recipe = results.rows[0]

      if (!recipe) return res.send('Recipe not found')

      // Get All Chefs
      results = await Recipe.allChefs()

      const chefs = results.rows

      // Get All Recipe Images
      results = await Recipe.files(id)
      let files = results.rows

      files = files.map((file) => ({
        ...file,
        src: getImageURL(file, req),
      }))

      const info = {
        page_title: `Editando | ${recipe.title}`,
        content_title: 'Editando receita',
      }

      return res.render('admin/recipes/edit', {
        info,
        recipe,
        chefs,
        files,
      })
    } catch (error) {
      throw new Error(error)
    }
  },

  async put(req, res) {
    const keys = Object.keys(req.body)

    keys.forEach((key) => {
      const isValid =
        req.body[key] === '' && key !== 'removed_files' && key !== 'information'
      if (isValid) return res.send('All fields required')
      return isValid
    })

    const { id, removed_files } = req.body

    let newFilesPromise = []
    let removeRecipeFile = []

    try {
      if (removed_files) {
        const removedFiles = removed_files.split(',')
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1)

        removeRecipeFile = removedFiles.map((file_id) => {
          return RecipeFile.delete(file_id)
        })
      }

      if (req.files.length > 5) return res.send('Limite máximo de 5 fotos')

      if (req.files.length !== 0) {
        newFilesPromise = req.files.map(async (file) => {
          const image = await File.create(file)
          const { id: fileId } = image.rows[0]
          return RecipeFile.create(id, fileId)
        })
      }

      await Promise.all([newFilesPromise, removeRecipeFile])

      await Recipe.update(req.body)
      return res.redirect(`/admin/recipes/${id}`)
    } catch (error) {
      throw new Error(error)
    }
  },

  async delete(req, res) {
    const { id } = req.params

    try {
      // Delete files from files and recipe_files table
      const results = await Recipe.files(id)

      if (results.rows.length !== 0) {
        const removeFiles = results.rows.map((file) => {
          const { id: fileId } = file

          return RecipeFile.delete(fileId)
        })

        await Promise.all(removeFiles)
      }

      await Recipe.delete(id)
    } catch (error) {
      throw new Error(error)
    }

    return res.redirect(`/admin/recipes`)
  },
}
