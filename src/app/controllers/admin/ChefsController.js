module.exports = {
  index(req, res) {
    const info = {
      page_title: 'Foodfy | Gerenciar chefs',
      content_title: 'Gerenciar chefs',
    }
    return res.render('admin/chefs/index', { info })
  },

  show(req, res) {
    const info = {
      page_title: 'Chef | Dailton Bastos',
      content_title: 'Chef: Dailton Bastos',
    }
    return res.render('admin/chefs/show', { info })
  },

  new(req, res) {
    const info = {
      page_title: 'Foodfy | Novo chef',
      content_title: 'Criando chef',
    }
    return res.render('admin/chefs/new', { info })
  },

  edit(req, res) {
    const info = {
      page_title: 'Foodfy | Editando chef',
      content_title: 'Editando chef',
    }
    return res.render('admin/chefs/edit', { info })
  },
}
