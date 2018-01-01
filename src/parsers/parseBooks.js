const Joi = require('joi')
const tap = require('../util/tap')

const schema = Joi.array().items(
  Joi.object().keys({
    title: Joi.string().required(),
    author: Joi.string().required(),
    year: Joi.number()
      .integer()
      .required(),
    link: Joi.string(),
  }),
)

const reverseBookYearComparator = (l, r) => {
  if (l.year < r.year) return 1
  if (l.year > r.year) return -1

  return 0
}

const parseBooks = bookStr => {
  if (bookStr === null || bookStr === '') {
    throw new Error('A JSON string must be supplied')
  }

  const { error, value } = Joi.validate(JSON.parse(bookStr), schema)

  if (error) {
    throw error
  }

  const years = new Set(
    value.sort(reverseBookYearComparator).map(book => book.year),
  )

  const sections = value.sort(reverseBookYearComparator).reduce((acc, next) => {
    return tap(acc, acc => {
      if (!acc.has(next.year)) {
        acc.set(next.year, [])
      }

      acc.get(next.year).push(next)
    })
  }, new Map())

  return {
    years,
    sections,
  }
}

module.exports = parseBooks
