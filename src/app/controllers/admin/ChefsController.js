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

      req.flash('success', 'Chef cadastrado com sucesso.')

      return res.redirect(`/admin/chefs/${id}`)
    } catch (error) {
      req.flash('error', 'Houve um erro, tente novamente!')
      res.redirect('/admin/chefs/new')
      throw new Error(error)
    }
  },

  async show(req, res) {
    const { chef } = req
    const { page } = req.query

    const info = {
      page_title: `Chef | ${chef.name}`,
      content_title: `Chef: ${chef.name}`,
    }

    async function getRecipeImage(recipeId) {
      const results = await Recipe.files(recipeId)

      const files = results.rows.map((file) => {
        return getImageURL(file, req)
      })

      return files[0]
    }

    try {
      const { file_id } = chef

      let results = await Chefs.avatar(file_id)

      const file = results.rows[0]

      let avatar = {}

      if (file) avatar = { ...file, src: getImageURL(file, req) }

      const params = pageLimit(page, 4)

      results = await Chefs.recipes(chef.id, params)

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
    const { chef } = req

    const info = {
      page_title: `Editando | ${chef.name}`,
      content_title: 'Editando chef',
    }

    try {
      const { file_id } = chef

      const results = await Chefs.avatar(file_id)

      const file = results.rows[0]

      let avatar = {}

      if (file) avatar = { ...file, src: getImageURL(file, req) }

      return res.render('admin/chefs/edit', { info, chef, avatar })
    } catch (error) {
      throw new Error(error)
    }
  },

  async put(req, res) {
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

      req.flash('success', 'Chef atualizado com sucesso.')

      return res.redirect(`/admin/chefs/${id}`)
    } catch (error) {
      req.flash('error', 'Houve um error, tente novamente!')
      res.redirect(`/admin/chefs/${id}`)
      throw new Error(error)
    }
  },

  async delete(req, res) {
    const { id, file_id } = req.chef

    try {
      await Chefs.delete(id)

      if (file_id) await File.delete(file_id)

      req.flash('success', 'Chef deletado com sucesso.')

      return res.redirect(`/admin/chefs`)
    } catch (error) {
      req.flash('error', 'Houve um error, tente novamente.')
      res.redirect(`/admin/chefs/${id}`)
      throw new Error(error)
    }
  },
}
