import Joi from 'joi'

const CURRENTLY_READING_KEY = 'Current'

const schema = Joi.object({
  meta: Joi.object()
    .keys({
      name: Joi.string().required(),
      email: Joi.string(),
      website: Joi.string(),
      theme: Joi.string().default('default'),
      feed: Joi.object().keys({
        title: Joi.string().required(),
        url: Joi.string().required(),
        avatarUrl: Joi.string(),
      }),
    })
    .required(),
  books: Joi.array().items(
    Joi.object()
      .keys({
        title: Joi.string().required(),
        author: Joi.string().required(),
        current: Joi.boolean(),
        year: Joi.number().integer(),
        link: Joi.string(),
        recommended: Joi.boolean(),
        finished: Joi.boolean(),
      })
      .when(Joi.object({ current: Joi.exist() }).unknown(), {
        then: Joi.object({
          year: Joi.forbidden(),
        }),
      })
      .when(Joi.object({ year: Joi.exist() }).unknown(), {
        then: Joi.object({
          current: Joi.forbidden(),
        }),
      }),
  ),
})

const reverseYearComparator = (l, r) => {
  if (l === CURRENTLY_READING_KEY) return -1
  if (r === CURRENTLY_READING_KEY) return 1
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

  const sections = new Map()

  value.books.forEach((book) => {
    let key

    if (book.current) {
      key = CURRENTLY_READING_KEY
    } else {
      key = book.year
    }

    if (!sections.get(key)) {
      sections.set(key, [])
    }

    sections.get(key).push(book)
  })

  const years = new Set(Array.from(sections.keys()).sort(reverseYearComparator))

  const meta = {
    name: value.meta.name,
    email: value.meta.email,
    website: value.meta.website,
    theme: value.meta.theme,
  }

  if (value.meta.feed) {
    meta.feed = {
      title: value.meta.feed.title,
      url: value.meta.feed.url,
      avatarUrl: value.meta.feed.avatarUrl,
    }
  }

  return {
    meta,
    years,
    sections,
  }
}

export { parseBooks, CURRENTLY_READING_KEY }
