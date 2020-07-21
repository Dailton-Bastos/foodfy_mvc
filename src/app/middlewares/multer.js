const multer = require('multer')

const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    return cb(null, './public/images')
  },
  filename: (_, file, cb) => {
    return cb(null, `${Date.now().toString()}-${file.originalname}`)
  },
})

const fileFilter = (_, file, cb) => {
  const isAccepted = ['image/png', 'image/jpg', 'image/jpeg']

  isAccepted.find((acceptedFormat) => acceptedFormat === file.mimetype)

  if (isAccepted) return cb(null, true)

  return cb(null, false)
}

module.exports = multer({
  storage,
  fileFilter,
})
