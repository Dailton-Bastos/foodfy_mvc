const Chefs = require('../../models/Chef')
const Recipe = require('../../models/Recipe')
const File = require('../../models/File')

const { pageLimit, paginate, getImageURL } = require('../../../libs/utils')

module.exports = {
  async index(req, res) {
    async function getAvatar(avatarId) {
      const results = await Chefs.avatar(avatarId)

      const files = results.rows.map((file) => {
        return getImageURL(file, req)
      })

      return files[0]
    }

    const info = {
      page_title: 'Foodfy | Gerenciar chefs',
      content_title: 'Gerenciar chefs',
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

      const chefsIndex = await Promise.all(chefsPromise)

      return res.render('admin/chefs/index', {
        info,
        chefs: chefsIndex,
        pagination,
      })
    } catch (error) {
      throw new Error(error)
    }
  },

  create(req, res) {
    const info = {
      page_title: 'Foodfy | Novo chef',
      content_title: 'Criando chef',
    }
    return res.render('admin/chefs/new', { info })
  },

  async post(req, res) {
    const keys = Object.keys(req.body)

    keys.forEach((key) => {
      const isValid = req.body[key] === '' && key !== 'file'
      if (isValid) return res.send('Nome é obrigatório')
      return isValid
    })

    try {
      const { name } = req.body

      let { file } = req.body

      if (req.file) {
        const avatar = await File.create(req.file)

        file = avatar.rows[0].id
      }

      const chef = await Chefs.create({
        name,
        file_id: file,
      })

      const { id } = chef.rows[0]

      return res.redirect(`/admin/chefs/${id}`)
    } catch (error) {
      throw new Error(error)
    }
  },

  async show(req, res) {
    const { id } = req.params
    const { page } = req.query

    async function getRecipeImage(recipeId) {
      const results = await Recipe.files(recipeId)

      const files = results.rows.map((file) => {
        return getImageURL(file, req)
      })

      return files[0]
    }

    try {
      let results = await Chefs.find(id)
      const chef = results.rows[0]

      if (!chef) return res.send('Chef not found')

      const info = {
        page_title: `Chef | ${chef.name}`,
        content_title: `Chef: ${chef.name}`,
      }

      const { file_id } = chef

      results = await Chefs.avatar(file_id)

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

      return res.render('admin/chefs/show', {
        info,
        chef,
        avatar,
        recipes: recipesIndex,
        pagination,
      })
    } catch (error) {
      throw new Error(error)
    }
  },

  async edit(req, res) {
    const { id } = req.params

    try {
      let results = await Chefs.find(id)
      const chef = results.rows[0]

      if (!chef) return res.send('Chef not found')

      const info = {
        page_title: `Editando | ${chef.name}`,
        content_title: 'Editando chef',
      }

      const { file_id } = chef

      results = await Chefs.avatar(file_id)

      const file = results.rows[0]

      let avatar = {}

      if (file) avatar = { ...file, src: getImageURL(file, req) }

      return res.render('admin/chefs/edit', { info, chef, avatar })
    } catch (error) {
      throw new Error(error)
    }
  },

  async put(req, res) {
    const keys = Object.keys(req.body)

    keys.forEach((key) => {
      const isValid =
        req.body[key] === '' && key !== 'file' && key !== 'removed_files'
      if (isValid) return res.send('Nome é obrigatório')
      return isValid
    })

    const { id, removed_files } = req.body

    try {
      if (req.file) {
        const avatar = await File.create(req.file)

        req.body.file_id = avatar.rows[0].id
      }

      await Chefs.update(req.body)

      if (removed_files) {
        const avatar_id = removed_files.replace(',', '')

        await File.delete(avatar_id)
      }

      return res.redirect(`/admin/chefs/${id}`)
    } catch (error) {
      throw new Error(error)
    }
  },

  async delete(req, res) {
    const { id } = req.params

    const { page } = req.query

    const params = pageLimit(page, 1)

    let results = await Chefs.recipes(id, params)
    const recipe = results.rows[0]

    if (recipe) return res.send('Não é possível deletar chef')

    results = await Chefs.find(id)
    const { file_id } = results.rows[0]

    await Chefs.delete(id)

    if (file_id) await File.delete(file_id)

    return res.redirect(`/admin/chefs`)
  },
}
