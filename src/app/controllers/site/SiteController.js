module.exports = {
  index(req, res) {
    const info = {
      page_title: 'Foodfy | Home',
    }

    const about = {
      title: 'As melhores receitas',
      description:
        'Aprenda a construir os melhores pratos com receitas criadas por profissionais do mundo inteiro',
    }

    return res.render('site/index', { about, info })
  },

  recipes(req, res) {
    const info = {
      page_title: 'Foodfy | Recipes',
    }

    return res.render('site/recipes/index', { info })
  },

  showRecipe(req, res) {
    const info = {
      page_title: 'Triplo bacon burguer',
    }
    return res.render('site/recipes/show', { info })
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

  search(req, res) {
    const info = {
      page_title: 'Search',
    }

    return res.render('site/search', { info })
  },

  chefs(req, res) {
    const info = {
      page_title: 'Foodfy | Chefs',
    }

    return res.render('site/chefs/index', { info })
  },
}
