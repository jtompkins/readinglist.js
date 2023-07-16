import { parseBooks, CURRENTLY_READING_KEY } from './parseBooks.js'

const TEST_BOOK_FILE = `
  {
    "meta": {
      "name": "Test User",
      "email": "test@test.com",
      "website": "http://www.test.com",
      "theme": "default"
    },
    "books": [
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
      },
      {
        "title": "Recommended Book",
        "author": "Recommended Author",
        "year": 2017,
        "link": "test.com/book20172",
        "recommended": true
      },
      {
        "title": "Not Recommended Book",
        "author": "Not Recommended Author",
        "year": 2017,
        "link": "test.com/book20172",
        "recommended": false
      },
      {
        "title": "Did Not Finish Book",
        "author": "Did Not Finish Author",
        "year": 2017,
        "link": "test.com/book20172",
        "finished": false
      }
    ]
  }
`

describe('parseBooks', () => {
  let books

  beforeEach(() => {
    books = parseBooks(TEST_BOOK_FILE)
  })

  it('parses a JSON string', () => {
    expect(books).toBeInstanceOf(Object)
  })

  it('provides an object with the proper structure', () => {
    expect(books).toHaveProperty('meta')
    expect(books).toHaveProperty('years')
    expect(books).toHaveProperty('sections')
  })

  describe('when parsing the meta config', () => {
    it('parses out the required meta values', () => {
      expect(books.meta.name).toBe('Test User')
      expect(books.meta.email).toBe('test@test.com')
      expect(books.meta.website).toBe('http://www.test.com')
      expect(books.meta.theme).toBe('default')
      expect(books.meta).not.toHaveProperty('feed')
    })

    describe('when the input is not well-formed', () => {
      const MISSING_REQUIRED_CONFIG_VALUES = `{
          "meta": {
            "name": "Test User",
          },
          "books": [
            {
              "title": "Currently Reading Book",
              "author": "test Author 4",
              "current": true,
              "link": "http://test.com/book4"
            }
          ]
        }
      `

      it('throws when the TOML is missing required keys', () => {
        expect(() => parseBooks(MISSING_REQUIRED_CONFIG_VALUES)).toThrow()
      })
    })

    describe('when a feed config is present', () => {
      const FEED_CONFIG_PRESENT = `
        {
          "meta": {
            "name": "Test User",
            "feed": {
              "title": "Test Feed",
              "url": "http://www.feedtest.com",
              "avatarUrl": "http://www.feedtest.com/avatar.png"
            }
          },
          "books": []
        }
      `

      it('parses the feed config', () => {
        const parsedBooks = parseBooks(FEED_CONFIG_PRESENT)

        expect(parsedBooks.meta).toHaveProperty('feed')
      })
    })
  })

  describe('when parsing the books array', () => {
    it('includes a Set of years in which books were read', () => {
      expect(books.years).toBeInstanceOf(Set)
    })

    it('sorts the years in reverse order', () => {
      expect(Array.from(books.years).length).toBe(3)
      expect(Array.from(books.years)).toEqual([
        CURRENTLY_READING_KEY,
        2017,
        2016,
      ])
    })

    it('includes a Map of sections matching books to years', () => {
      expect(books.sections).toBeInstanceOf(Map)
      expect(books.sections.size).toEqual(3)
      expect(books.sections.keys()).toContain(CURRENTLY_READING_KEY)
      expect(books.sections.keys()).toContain(2017)
      expect(books.sections.keys()).toContain(2016)
    })

    it('preserves the order of the books in the JSON file', () => {
      const lastYearsBooks = books.sections.get(2017)

      expect(lastYearsBooks[0].title).toEqual('Test Book 2017 1')
      expect(lastYearsBooks[1].title).toEqual('Test Book 2017 2')
    })

    describe('when there are no current books', () => {
      const NO_CURRENT_BOOK = `
        {
          "meta": {
            "name": "Test User",
            "email": "test@test.com",
            "website": "http://www.test.com"
          },
          "books": [
            {
              "title": "Test Book 2017 1",
              "author": "Test Author 2",
              "year": 2017,
              "link": "test.com/book20171"
            }
          ]
        }
      `

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

    describe('when there are multiple current books', () => {
      const MULTIPLE_CURRENT_BOOKS = `
        {
          "meta": {
            "name": "Test User",
            "email": "test@test.com",
            "website": "http://www.test.com"
          },
          "books": [
            {
              "title": "Test Book 2017 1",
              "author": "Test Author 1",
              "current": true,
              "link": "test.com/book20171"
            },

            {
              "title": "Test Book 2017 2",
              "author": "Test Author 2",
              "current": true,
              "link": "test.com/book20172"
            }
          ]
        }
      `

      beforeEach(() => {
        books = parseBooks(MULTIPLE_CURRENT_BOOKS)
      })

      it('writes two books into the current section', () => {
        expect(books.years.size).toEqual(1)
        expect(books.years).toContain(CURRENTLY_READING_KEY)

        const currentBooks = books.sections.get(CURRENTLY_READING_KEY)
        expect(currentBooks).toBeDefined()
        expect(currentBooks.length).toEqual(2)
      })
    })

    describe('when the recommended field is set', () => {
      it('marks a book as recommended if a true value is provided', () => {
        const lastYearsBooks = books.sections.get(2017)

        expect(lastYearsBooks[2].recommended).toBeDefined()
        expect(lastYearsBooks[2].recommended).toBe(true)
      })

      it('marks a book as not ecommended if a false value is provided', () => {
        const lastYearsBooks = books.sections.get(2017)

        expect(lastYearsBooks[3].recommended).toBeDefined()
        expect(lastYearsBooks[3].recommended).toBe(false)
      })
    })

    describe('when the recommended field is not set', () => {
      it('does not parse a falsey falue', () => {
        const lastYearsBooks = books.sections.get(2017)

        expect(lastYearsBooks[0].recommended).not.toBeDefined()
      })
    })

    describe('when the DNF flag is not provided', () => {
      it('parses a value if it is provided', () => {
        const lastYearsBooks = books.sections.get(2017)

        expect(lastYearsBooks[4].finished).toBeDefined()
        expect(lastYearsBooks[4].finished).toBe(false)
      })

      it('does not parse a value if one is not provided', () => {
        const lastYearsBooks = books.sections.get(2017)

        expect(lastYearsBooks[0].finished).not.toBeDefined()
      })
    })

    describe('when the input is not well-formed', () => {
      it('throws when the input is empty', () => {
        expect(() => parseBooks('')).toThrow()
      })

      it('throws when the JSON is not an array', () => {
        const BOOKS_ARE_NOT_AN_ARRAY = `
          {
            "meta": {
              "name": "Test User",
              "email": "test@test.com",
              "website": "http://www.test.com"
            },
            "books": {
              "title": "Test Book",
              "author": "Test Author",
              "year": 2017,
              "link": "http://test.com"
            }
          }
        `

        expect(() => parseBooks(BOOKS_ARE_NOT_AN_ARRAY)).toThrow()
      })

      it('throws when the JSON is missing keys', () => {
        const BOOKS_MISSING_REQUIRED_KEYS = `
          {
            "meta": {
              "name": "Test User",
              "email": "test@test.com",
              "website": "http://www.test.com"
            },
            "books": [
              {
                "link": "http://test.com"
              }
            ]  
          }
        `

        expect(() => parseBooks(BOOKS_MISSING_REQUIRED_KEYS)).toThrow()
      })

      describe('when neither year nor current are present on the object', () => {
        const BOOKS_MISSING_YEAR_AND_CURRENT = `
          {
            "meta": {
              "name": "Test User",
              "email": "test@test.com",
              "website": "http://www.test.com"
            },
            "books": [
              {
                "title": "Test Book",
                "author": "Test Author",
              }
            ]    
          }
        `

        it('throws', () => {
          expect(() => parseBooks(BOOKS_MISSING_YEAR_AND_CURRENT)).toThrow()
        })
      })

      describe('when both year and current are present on the object', () => {
        const BOOKS_INVALID_COMBINATION_OF_CURRENT_AND_YEAR = `
          {
            "meta": {
              "name": "Test User",
              "email": "test@test.com",
              "website": "http://www.test.com"
            },
            "books": [
              {
                "title": "Test Book",
                "author": "Test Author",
                "year": 2023,
                "current": true
              }
            ]
          }
        `

        it('throws', () => {
          expect(() =>
            parseBooks(BOOKS_INVALID_COMBINATION_OF_CURRENT_AND_YEAR),
          ).toThrow()
        })
      })
    })
  })
})
