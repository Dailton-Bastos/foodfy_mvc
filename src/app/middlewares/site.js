module.exports = (req, res, next) => {
  if (req.session) {
    res.locals.session = req.session.user
  }
  return next()
}
