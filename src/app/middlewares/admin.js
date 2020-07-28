module.exports = (req, res, next) => {
  const { is_admin } = req.session.user

  if (is_admin) return next()

  return res.redirect('/admin/profile')
}
