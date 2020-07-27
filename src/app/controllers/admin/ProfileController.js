module.exports = {
  index(req, res) {
    const info = {
      page_title: 'Foodfy | Dailton Bastos',
      content_title: 'Olá Dailton Bastos',
    }
    return res.render('admin/profile/index', { info })
  },
}
