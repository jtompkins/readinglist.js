import { join } from 'path'
import * as cheerio from 'cheerio'

import { getTemplatePath, getStylePath, renderTemplate } from './renderer.js'
import { CURRENTLY_READING_KEY } from './parsers/parseBooks.js'

const TEMPLATE_PATH = './templates/default.pug'
const TEST_DATA = {
  config: {
    name: 'Test Name',
  },
  books: {
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
  },
}

const TEST_DATA_WITH_MULTIPLE_YEARS = {
  config: {
    name: 'Test Name',
  },
  books: {
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
  },
}

const TEST_DATA_WITH_CURRENT = {
  config: {
    name: 'Test Name',
  },
  books: {
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
  },
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
      it('renders the header element', () => {
        expect($('.reading-list__header').length).toBe(1)
      })

      it('renders the hero banner', () => {
        expect($('.header__hero-image').length).toBe(1)
      })

      it('renders the avatar image', () => {
        expect($('.header__avatar-image').length).toBe(1)
      })

      it('renders the title', () => {
        const title = $('.title')
        expect(title.length).toBe(1)
        expect(title.text()).toBe('Test Name')
      })

      it('renders the subtitle', () => {
        const subtitle = $('.subtitle')
        expect(subtitle.length).toBe(1)
        expect(subtitle.text()).toBe('Reading List')
      })
    })

    it('renders the footer', () => {
      expect($('.reading-list__footer').length).toBe(1)
    })

    describe('when rendering the navigation', () => {
      it('renders a list of years', () => {
        expect($('nav.reading-list__year-list').length).toBe(1)
        expect($('nav.reading-list__year-list ul li').length).toBe(1)
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
          expect($('nav.reading-list__year-list').length).toBe(1)
          expect($('nav.reading-list__year-list ul li').length).toBe(2)
        })

        it('renders the years in reverse order', () => {
          const years = $('nav.reading-list__year-list ul li')

          expect($(years[0]).text()).toBe('2024')
        })
      })

      describe('when a book is currently being read', () => {
        beforeEach(() => {
          const output = renderTemplate(TEMPLATE_PATH, TEST_DATA_WITH_CURRENT)
          $ = cheerio.load(output)
        })

        it('renders the currently-reading year', () => {
          expect($('nav.reading-list__year-list').length).toBe(1)

          const navItems = $('nav.reading-list__year-list ul li')
          expect(navItems.length).toBe(2)
          expect($(navItems[0]).text()).toBe(CURRENTLY_READING_KEY)
        })
      })
    })

    describe('when rendering the list of books', () => {
      it('outputs a header for each year', () => {
        expect($('.reading-list__year h2').length).toBe(1)
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
          const sections = $('.reading-list__year h2')

          expect($(sections[0]).text()).toBe('2024')
        })
      })

      describe('when there is a book being currently read', () => {
        beforeEach(() => {
          const output = renderTemplate(TEMPLATE_PATH, TEST_DATA_WITH_CURRENT)
          $ = cheerio.load(output)
        })

        it('renders the current section first', () => {
          const sections = $('.reading-list__year h2')

          expect($(sections[0]).text()).toBe(CURRENTLY_READING_KEY)
        })
      })

      it('outputs a line for each book', () => {
        expect($('.book-list__book').length).toBe(1)
      })

      it('writes the title of the book', () => {
        const book = $('.book-list__book')[0]

        expect($('.book-list__title', book).length).toBe(1)
        expect($('.book-list__title', book).text()).toBe('Test Title 1')
      })

      it('writes the author of the book', () => {
        const book = $('.book-list__book')[0]

        expect($('.book-list__author', book).length).toBe(1)
        expect($('.book-list__author', book).text()).toBe('Test Author 1')
      })

      describe('when a link is provided', () => {
        it('writes a link to the book', () => {
          const book = $('.book-list__book')[0]

          expect($('.book-list__title a', book).length).toBe(1)
          expect($('.book-list__title a', book).attr('href')).toBe(
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
          const book = $('.book-list__book')[0]

          expect($('.book-list__title', book).length).toBe(1)
          expect($('.book-list__title a', book).length).toBe(0)
          expect($('.book-list__title', book).text()).toBe('Test Title 2')
        })
      })
    })
  })
})
