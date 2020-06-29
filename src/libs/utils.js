module.exports = {
  date(timestamp) {
    const date = new Date(timestamp)
    const year = date.getUTCFullYear()
    const month = `0${date.getUTCMonth() + 1}`.slice(-2)
    const day = `0${date.getUTCDate()}`.slice(-2)

    return { day, month, year, iso: `${year}-${month}-${day}` }
  },

  paginate(page, limit) {
    page = page || 1
    const offset = limit * (page - 1)

    return {
      page,
      limit,
      offset,
    }
  },
}
