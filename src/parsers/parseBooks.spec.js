import { parseBooks, CURRENTLY_READING_KEY } from './parseBooks.js'

const SAMPLE_INPUT = `
[
  {
    "title": "Currently Reading Book",
    "author": "test Author 4",
    "current": true,
    "link": "http://test.com/book4"
  },
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

const NO_CURRENT_BOOK = `
[
  {
    "title": "Test Book 2017 1",
    "author": "Test Author 2",
    "year": 2017,
    "link": "test.com/book20171"
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

const MISSING_YEAR_AND_CURRENT = `
[
  {
    "title": "Test Book",
    "author": "Test Author",
  }
]
`

const INVALID_COMBINATION_OF_CURRENT_AND_YEAR = `
  [
    {
      "title": "Test Book",
      "author": "Test Author",
      "year": 2023,
      "current": true
    }
  ]
`

describe('parseBooks', () => {
  let books

  beforeEach(() => {
    books = parseBooks(SAMPLE_INPUT)
  })

  it('parses a JSON string', () => {
    expect(books).toBeInstanceOf(Object)
  })

  it('provides an object with years and sections keys', () => {
    expect(books).toHaveProperty('years')
    expect(books).toHaveProperty('sections')
  })

  it('includes a Set of years in which books were read', () => {
    expect(books.years).toBeInstanceOf(Set)
  })

  it('sorts the years in reverse order', () => {
    expect(Array.from(books.years).length).toBe(3)
    expect(Array.from(books.years)).toEqual([CURRENTLY_READING_KEY, 2017, 2016])
  })

  it('includes a Map of sections matching books to years', () => {
    expect(books.sections).toBeInstanceOf(Map)
    expect(books.sections.size).toEqual(3)
    expect(books.sections.keys()).toContain(CURRENTLY_READING_KEY)
    expect(books.sections.keys()).toContain(2017)
    expect(books.sections.keys()).toContain(2016)
  })

  describe('when there are no current books', () => {
    beforeEach(() => {
      books = parseBooks(NO_CURRENT_BOOK)
    })

    it('does not include current in the list of years', () => {
      expect(books.years.size).toEqual(1)
      expect(books.years).not.toContain(CURRENTLY_READING_KEY)
    })

    it('does not have a current section in the list of books', () => {
      expect(books.sections.size).toEqual(1)
      expect(books.sections.keys).not.toContain(CURRENTLY_READING_KEY)
    })
  })

  it('preserves the order of the books in the JSON file', () => {
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

    describe('when neither year nor current are present on the object', () => {
      it('throws', () => {
        expect(() => parseBooks(MISSING_YEAR_AND_CURRENT)).toThrow()
      })
    })

    describe('when both year and current are present on the object', () => {
      it('throws', () => {
        expect(() =>
          parseBooks(INVALID_COMBINATION_OF_CURRENT_AND_YEAR),
        ).toThrow()
      })
    })
  })
})
