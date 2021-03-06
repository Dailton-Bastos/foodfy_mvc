const { randomBytes } = require('crypto')
const User = require('../../models/User')
const RecipeFiles = require('../../models/RecipeFile')
const File = require('../../models/File')

const SendPasswordMail = require('../../jobs/SendPasswordMail')

const Queue = require('../../../libs/Queue')
const { pageLimit, paginate } = require('../../../libs/utils')

module.exports = {
  async index(req, res) {
    const info = {
      page_title: 'Foodfy | Gerenciar usuários',
      content_title: 'Gerenciar usuários',
    }

    const { page } = req.query

    const params = pageLimit(page, 6)

    try {
      const results = await User.findAll(params)
      const users = results.rows

      const pagination = paginate(users, params)

      return res.render('admin/users/index', { info, users, pagination })
    } catch (error) {
      req.flash('error', 'Algum error aconteceu!')
      res.redirect('/admin/users')
      throw new Error(error)
    }
  },

  create(req, res) {
    const info = {
      page_title: 'Foodfy | Novo usuário',
      content_title: 'Criando usuário',
    }

    return res.render('admin/users/new', { info })
  },

  async post(req, res) {
    const { name, email, is_admin } = req.body

    try {
      const password = randomBytes(5).toString('hex')

      await User.create({
        name,
        email,
        password,
        is_admin: is_admin || false,
      })

      req.flash('success', 'Usuário cadastrado com sucesso.')

      // Sending email with user password
      const user = { name, email, password }
      await Queue.add(SendPasswordMail.key, user)

      return res.redirect('/admin/users')
    } catch (error) {
      req.flash('error', 'Error ao criar usuário!')
      res.redirect(`/admin/users/new`)
      throw new Error(error)
    }
  },

  edit(req, res) {
    const { user } = req

    const info = {
      page_title: `Atualizar | ${user.name}`,
      content_title: 'Atualizar usuário',
    }

    return res.render('admin/users/edit', { info, user })
  },

  async update(req, res) {
    try {
      const { id } = req.user

      const { name, email, is_admin } = req.body

      await User.update(id, {
        name,
        email,
        is_admin: is_admin || false,
      })

      req.flash('success', 'Usuário atualizado com sucesso.')
      return res.redirect('/admin/users')
    } catch (error) {
      const { id } = req.user
      req.flash('error', 'Error ao atualizar usuário!')
      res.redirect(`/admin/users/${id}/edit`)
      throw new Error(error)
    }
  },

  async delete(req, res) {
    const { id: userSession } = req.session.user
    const { id } = req.params

    try {
      if (userSession === +id) {
        req.flash('error', 'Operação não permitida!')
        return res.redirect('/admin/users')
      }

      const recipesFiles = await RecipeFiles.fileRecipesUser(id)

      if (recipesFiles.length) {
        try {
          recipesFiles.forEach(async (file) => File.delete(file.id))
        } catch (error) {
          throw new Error(error)
        }
      }

      await User.delete(id)

      req.flash('success', 'Conta deletada com sucesso.')
      return res.redirect('/admin/users')
    } catch (error) {
      req.flash('error', 'Erro ao deletar conta!')
      res.redirect('/admin/users')
      throw new Error(error)
    }
  },
}
