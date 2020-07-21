module.exports = {
  date(timestamp) {
    const date = new Date(timestamp)
    const year = date.getUTCFullYear()
    const month = `0${date.getUTCMonth() + 1}`.slice(-2)
    const day = `0${date.getUTCDate()}`.slice(-2)

    return { day, month, year, iso: `${year}-${month}-${day}` }
  },

  pageLimit(page, limit) {
    page = page || 1
    const offset = limit * (page - 1)

    return {
      page,
      limit,
      offset,
    }
  },

  paginate(results, params) {
    const { page, limit } = params

    return {
      total: results[0] ? Math.ceil(results[0].total / limit) : 0,
      page,
    }
  },

  getImageURL(image, params) {
    const { protocol, headers } = params
    return `${protocol}://${headers.host}${image.path.replace('public', '')}`
  },
}
