import Joi from 'joi'

const schema = Joi.array().items(
  Joi.object().keys({
    title: Joi.string().required(),
    author: Joi.string().required(),
    year: Joi.number().integer().required(),
    link: Joi.string(),
  }),
)

const reverseYearComparator = (l, r) => {
  if (l < r) return 1
  if (l > r) return -1

  return 0
}

const parseBooks = (bookStr) => {
  if (bookStr === null || bookStr === '') {
    throw new Error('A JSON string must be supplied')
  }

  const { error, value } = schema.validate(JSON.parse(bookStr))

  if (error) {
    throw error
  }

  const years = new Set(
    value.map((book) => book.year).sort(reverseYearComparator),
  )

  const sections = new Map()

  // insert the years in sorted order
  years.forEach((year) => sections.set(year, []))
  value.forEach((book) => sections.get(book.year).push(book))

  return {
    years,
    sections,
  }
}

export default parseBooks
