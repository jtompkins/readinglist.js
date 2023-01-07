import { join } from 'path'
import { getTemplatePath, getStylePath, renderTemplate } from './renderer.js'
import * as cheerio from 'cheerio';

const TEMPLATE_PATH = './templates/default.pug'
const TEST_CONTEXT = { 
  config: {
    name: "Test Name",
  }, 
  books: {
    years: new Set([2023, 2024]),
    sections: new Map([
      [
        2023, 
        [{
          title: "Test Title 1",
          author: "Test Author 1",
          link: "http://www.test.com",
          year: "2023",
        }]
      ],
      [
        2024,
        [{
          title: "Test Title 2",
          author: "Test Author 2",
          year: "2024",
        }]
      ]
    ]
  ),
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
      const output = renderTemplate(TEMPLATE_PATH, TEST_CONTEXT)
      $ = cheerio.load(output)
    })

    describe("when rendering the header", () => {
      it("renders the header element", () => {
        expect($('.reading-list__header').length).toBe(1)
      })
      
      it("renders the hero banner", () => {
        expect($('.header__hero-image').length).toBe(1)
      })

      it("renders the avatar image", () => {
        expect($('.header__avatar-image').length).toBe(1)
      })

      it("renders the title", () => {
        const title = $('.title')
        expect(title.length).toBe(1)
        expect(title.text()).toBe("Test Name")
      })

      it("renders the subtitle", () => {
        const subtitle = $('.subtitle')
        expect(subtitle.length).toBe(1)
        expect(subtitle.text()).toBe("Reading List")
      })
    })

    it('renders the footer', () => {
      expect($('.reading-list__footer').length).toBe(1)
    })

    it('renders a list of years', () => {
      expect($('nav.reading-list__year-list').length).toBe(1)
      expect($('nav.reading-list__year-list ul li').length).toBe(2)
    })

    describe('when rendering the list of books', () => {
      it('outputs a header for each year', () => {
        expect($('.reading-list__year h2').length).toBe(2)
      })

      it('outputs a line for each book', () => {
        expect($('.book-list__book').length).toBe(2)
      })

      it('writes the title of the book', () => {
        const firstBook = $('.book-list__book')[0]

        expect($(".book-list__title", firstBook).length).toBe(1)
        expect($(".book-list__title", firstBook).text()).toBe("Test Title 1")
      })

      it('writes the author of the book', () => {
        const firstBook = $('.book-list__book')[0]

        expect($(".book-list__author", firstBook).length).toBe(1)
        expect($(".book-list__author", firstBook).text()).toBe("Test Author 1")
      })

      describe('when a link is provided', () => {
        it('writes a link to the book', () => {
          const firstBook = $('.book-list__book')[0]

          expect($(".book-list__title a", firstBook).length).toBe(1)
          expect($(".book-list__title a", firstBook).attr('href')).toBe("http://www.test.com")
        })
      })

      describe('when a link is not provided', () => {
        it('does not write a link to the book', () => {
          const secondBook = $('.book-list__book')[1]

          expect($(".book-list__title", secondBook).length).toBe(1)
          expect($(".book-list__title a", secondBook).length).toBe(0)
          expect($(".book-list__title", secondBook).text()).toBe("Test Title 2")
        })
      })
    })
  })
})
