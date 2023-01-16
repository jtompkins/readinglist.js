import { join } from 'path'
import * as cheerio from 'cheerio'

import { getTemplatePath, getStylePath, renderTemplate } from './renderer.js'
import { CURRENTLY_READING_KEY } from './parsers/parseBooks.js'

const TEMPLATE_PATH = './templates/default.pug'

const TEST_DATA = {
  meta: {
    name: 'Test Name',
  },
  years: new Set([2023]),
  sections: new Map([
    [
      2023,
      [
        {
          title: 'Test Title 1',
          author: 'Test Author 1',
          link: 'http://www.test.com',
          year: '2023',
        },
      ],
    ],
  ]),
}

const TEST_DATA_WITH_MULTIPLE_YEARS = {
  meta: {
    name: 'Test Name',
  },
  years: new Set([2024, 2023]),
  sections: new Map([
    [
      2023,
      [
        {
          title: 'Test Title 1',
          author: 'Test Author 1',
          link: 'http://www.test.com',
          year: '2023',
        },
      ],
    ],
    [
      2024,
      [
        {
          title: 'Test Title 2',
          author: 'Test Author 2',
          year: '2024',
        },
      ],
    ],
  ]),
}

const TEST_DATA_WITH_CURRENT = {
  meta: {
    name: 'Test Name',
  },
  years: new Set([CURRENTLY_READING_KEY, 2023]),
  sections: new Map([
    [
      CURRENTLY_READING_KEY,
      [
        {
          title: 'Test Title 1',
          author: 'Test Author 1',
          link: 'http://www.test.com',
          current: true,
        },
      ],
    ],
    [
      2023,
      [
        {
          title: 'Test Title 2',
          author: 'Test Author 2',
          year: '2023',
        },
      ],
    ],
  ]),
}

describe('Render utils', () => {
  describe('getTemplatePath', () => {
    it('returns the path to the template in the module', () => {
      const templatePath = getTemplatePath('default')

      const realTemplatePath = join(process.cwd(), 'templates', 'default.pug')

      expect(templatePath).toEqual(realTemplatePath)
    })
  })

  describe('getStylePath', () => {
    it('returns the path to the CSS theme in the module', () => {
      const stylePath = getStylePath('default')
      const realStylePath = join(process.cwd(), 'themes', 'default.css')

      expect(stylePath).toEqual(realStylePath)
    })
  })

  describe('renderTemplate', () => {
    let $

    beforeEach(() => {
      const output = renderTemplate(TEMPLATE_PATH, TEST_DATA)
      $ = cheerio.load(output)
    })

    describe('when rendering the header', () => {
      it('renders the gradient stripe', () => {
        expect($('.gradient').length).toBe(1)
      })

      it('renders the avatar image', () => {
        expect($('.logo').length).toBe(1)
      })

      it('renders the title', () => {
        const title = $('.title h1')
        expect(title.length).toBe(1)
        expect(title.text()).toBe("What I'm Reading")
      })

      it('renders the subtitle', () => {
        const subtitle = $('.title h2')
        expect(subtitle.length).toBe(1)
        expect(subtitle.text()).toBe('Test Name')
      })
    })

    it('renders the footer', () => {
      expect($('footer').length).toBe(1)
    })

    describe('when rendering the navigation', () => {
      it('renders a list of years', () => {
        expect($('nav').length).toBe(1)
        expect($('nav ul li').length).toBe(1)
      })

      describe('when there are multiple years', () => {
        beforeEach(() => {
          const output = renderTemplate(
            TEMPLATE_PATH,
            TEST_DATA_WITH_MULTIPLE_YEARS,
          )
          $ = cheerio.load(output)
        })

        it('renders each year', () => {
          expect($('nav').length).toBe(1)
          expect($('nav ul li').length).toBe(2)
        })

        it('renders the years in reverse order', () => {
          const years = $('nav ul li')

          expect($(years[0]).text()).toBe('2024')
        })
      })

      describe('when a book is currently being read', () => {
        beforeEach(() => {
          const output = renderTemplate(TEMPLATE_PATH, TEST_DATA_WITH_CURRENT)
          $ = cheerio.load(output)
        })

        it('renders the currently-reading year', () => {
          expect($('nav').length).toBe(1)

          const navItems = $('nav ul li')
          expect(navItems.length).toBe(2)
          expect($(navItems[0]).text()).toBe(CURRENTLY_READING_KEY)
        })
      })
    })

    describe('when rendering the list of books', () => {
      it('outputs a header for each year', () => {
        expect($('.year h2').length).toBe(1)
      })

      describe('when there are multiple years', () => {
        beforeEach(() => {
          const output = renderTemplate(
            TEMPLATE_PATH,
            TEST_DATA_WITH_MULTIPLE_YEARS,
          )
          $ = cheerio.load(output)
        })

        it('renders the years in reverse order', () => {
          const sections = $('.year h2')

          expect($(sections[0]).text()).toBe('2024')
        })
      })

      describe('when there is a book being currently read', () => {
        beforeEach(() => {
          const output = renderTemplate(TEMPLATE_PATH, TEST_DATA_WITH_CURRENT)
          $ = cheerio.load(output)
        })

        it('renders the current section first', () => {
          const sections = $('.year h2')

          expect($(sections[0]).text()).toBe('Currently Reading')
        })
      })

      it('outputs a line for each book', () => {
        expect($('.book').length).toBe(1)
      })

      it('writes the title of the book', () => {
        const book = $('.book')[0]

        expect($('.book-title', book).length).toBe(1)
        expect($('.book-title', book).text()).toBe('Test Title 1')
      })

      it('writes the author of the book', () => {
        const book = $('.book')[0]

        expect($('.book-author', book).length).toBe(1)
        expect($('.book-author', book).text()).toBe('Test Author 1')
      })

      describe('when a link is provided', () => {
        it('writes a link to the book', () => {
          const book = $('.book')[0]

          expect($('.book-title a', book).length).toBe(1)
          expect($('.book-title a', book).attr('href')).toBe(
            'http://www.test.com',
          )
        })
      })

      describe('when a link is not provided', () => {
        beforeEach(() => {
          const output = renderTemplate(
            TEMPLATE_PATH,
            TEST_DATA_WITH_MULTIPLE_YEARS,
          )
          $ = cheerio.load(output)
        })

        it('does not write a link to the book', () => {
          const book = $('.book')[0]

          expect($('.book-title', book).length).toBe(1)
          expect($('.book-title a', book).length).toBe(0)
          expect($('.book-title', book).text()).toBe('Test Title 2')
        })
      })

      it('renders the tags element', () => {
        const book = $('.book')[0]

        expect($('.tags', book).length).toBe(1)
      })

      describe('when a book was not finished', () => {
        const TEST_DATA_WITH_DNF = {
          meta: {
            name: 'Test Name',
          },
          years: new Set([2023]),
          sections: new Map([
            [
              2023,
              [
                {
                  title: 'Test Title 2',
                  author: 'Test Author 2',
                  year: '2023',
                  finished: false,
                },
              ],
            ],
          ]),
        }

        beforeEach(() => {
          const output = renderTemplate(TEMPLATE_PATH, TEST_DATA_WITH_DNF)
          $ = cheerio.load(output)
        })

        it('renders the correct DNF element', () => {
          const book = $('.book')[0]

          expect($('.tags .dnf', book).length).toBe(1)
        })
      })

      describe('when a recommendation was set', () => {
        const TEST_DATA_WITH_RECOMMENDATIONS = {
          meta: {
            name: 'Test Name',
          },
          years: new Set([2023]),
          sections: new Map([
            [
              2023,
              [
                {
                  title: 'Test Title 2',
                  author: 'Test Author 2',
                  year: '2023',
                  recommended: true,
                },
                {
                  title: 'Test Title 3',
                  author: 'Test Author 3',
                  year: '2023',
                  recommended: false,
                },
              ],
            ],
          ]),
        }

        beforeEach(() => {
          const output = renderTemplate(
            TEMPLATE_PATH,
            TEST_DATA_WITH_RECOMMENDATIONS,
          )
          $ = cheerio.load(output)
        })

        it('renders the correct recommendation element', () => {
          const recommendedBook = $('.book')[0]

          expect($('.tags .recommended', recommendedBook).length).toBe(1)

          const notRecommendedBook = $('.book')[1]

          expect($('.tags .not-recommended', notRecommendedBook).length).toBe(1)
        })
      })
    })
  })
})
