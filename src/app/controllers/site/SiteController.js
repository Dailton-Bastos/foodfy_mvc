module.exports = {
  index(req, res) {
    const page_title = 'Foodfy | Home'

    const about = {
      title: 'As melhores receitas',
      description:
        'Aprenda a construir os melhores pratos com receitas criadas por profissionais do mundo inteiro',
    }

    return res.render('site/index', { about, page_title })
  },

  recipes(req, res) {
    const page_title = 'Foodfy | Recipes'

    return res.render('site/recipes/index', { page_title })
  },

  showRecipe(req, res) {
    const page_title = 'Triplo bacon burguer'
    return res.render('site/recipes/show', { page_title })
  },

  about(req, res) {
    const page_title = 'Foodfy | About'

    const about = {
      title: 'Sobre o Foodfy',
    }

    const start = {
      title: 'Como tudo começou',
    }

    const recipes = {
      title: 'Nossas receitas',
    }

    return res.render('site/about', { page_title, about, start, recipes })
  },

  search(req, res) {
    const page_title = 'Foodfy | Search'

    return res.render('site/search', { page_title })
  },

  chefs(req, res) {
    const page_title = 'Foodfy | Chefs'

    return res.render('site/chefs/index', { page_title })
  },
}
