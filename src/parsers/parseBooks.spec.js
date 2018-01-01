const parseBooks = require('./parseBooks')

const SAMPLE_INPUT = `
[
  {
    "title": "Test Book 2016",
    "author": "Test Author 1",
    "year": 2016,
    "link":
      "https://test.com/book2016"
  },
  {
    "title": "Test Book 2017 1",
    "author": "Test Author 2",
    "year": 2017,
    "link": "test.com/book20171"
  },
  {
    "title": "Test Book 2017 2",
    "author": "Test Author 3",
    "year": 2017,
    "link": "test.com/book20172"
  }
]
`

const MISSING_REQUIRED_KEYS = `
  [
    {
      "link": "http://test.com"
    }
  ]
`

const NOT_AN_ARRAY = `
  {
    "title": "Test Book",
    "author": "Test Author",
    "year": 2017,
    "link": "http://test.com"
  }
`

describe('parseBooks', () => {
  it('parses a JSON string', () => {
    const books = parseBooks(SAMPLE_INPUT)
    expect(books).toBeInstanceOf(Object)
  })

  it('provides an object with years and sections keys', () => {
    const books = parseBooks(SAMPLE_INPUT)

    expect(books).toHaveProperty('years')
    expect(books).toHaveProperty('sections')
  })

  it('includes a Set of years in which books were read', () => {
    const books = parseBooks(SAMPLE_INPUT)

    expect(books.years).toBeInstanceOf(Set)
  })

  it('sorts the years in reverse order', () => {
    const books = parseBooks(SAMPLE_INPUT)

    expect(Array.from(books.years)).toEqual([2017, 2016])
  })

  it('includes a Map of sections matching books to years', () => {
    const books = parseBooks(SAMPLE_INPUT)

    expect(books.sections).toBeInstanceOf(Map)
    expect(books.sections.size).toEqual(2)
  })

  it('sorts the sections in reverse year order', () => {
    const books = parseBooks(SAMPLE_INPUT)

    expect(Array.from(books.sections.keys())).toEqual([2017, 2016])
  })

  it('preserves the order of the books in the JSON file', () => {
    const books = parseBooks(SAMPLE_INPUT)

    const lastYearsBooks = books.sections.get(2017)

    expect(lastYearsBooks[0].title).toEqual('Test Book 2017 1')
    expect(lastYearsBooks[1].title).toEqual('Test Book 2017 2')
  })

  describe('when the input is not well-formed', () => {
    it('throws when the input is empty', () => {
      expect(() => parseBooks('')).toThrow()
    })

    it('throws when the JSON is not an array', () => {
      expect(() => parseBooks(NOT_AN_ARRAY)).toThrow()
    })

    it('throws when the JSON is missing keys', () => {
      expect(() => parseBooks(MISSING_REQUIRED_KEYS)).toThrow()
    })
  })
})
