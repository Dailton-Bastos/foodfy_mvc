module.exports = {
  index(req, res) {
    const info = {
      page_title: 'Foodfy | Gerenciar receitas',
      content_title: 'Gerenciar receitas',
    }
    return res.render('admin/recipes/index', { info })
  },

  show(req, res) {
    const info = {
      page_title: 'Foodfy | Triplo Bacon Burguer',
      content_title: 'Receita: Triplo Bacon Burguer',
    }
    return res.render('admin/recipes/show', { info })
  },

  new(req, res) {
    const info = {
      page_title: 'Foodfy | Nova receita',
      content_title: 'Criando receita',
    }
    return res.render('admin/recipes/new', { info })
  },

  edit(req, res) {
    const info = {
      page_title: 'Foodfy | Editando receita',
      content_title: 'Editando receita',
    }
    return res.render('admin/recipes/edit', { info })
  },
}
