import { renderFeed } from './feedRenderer'
import { CURRENTLY_READING_KEY } from './parsers/parseBooks.js'

const TEST_DATA = {
  meta: {
    name: 'Test Name',
    feed: {
      title: 'Test Feed',
      url: 'http://www.feedtest.com',
      avatarUrl: 'http://www.feedtest.com/avatar.png',
    },
  },
  years: new Set([CURRENTLY_READING_KEY, 2023]),
  sections: new Map([
    [
      CURRENTLY_READING_KEY,
      [
        {
          title: 'Current Book',
          author: 'Current Author',
          link: 'http://www.test.com',
          current: true,
        },
      ],
    ],
    [
      2023,
      [
        {
          title: 'No Link Book',
          author: 'No Link Author',
          year: '2023',
        },

        {
          title: 'Link Book',
          author: 'Link Author',
          link: 'http://www.test.com',
          year: '2023',
        },

        {
          title: 'Recommended Book',
          author: 'Recommended Author',
          year: '2023',
          recommended: true,
        },

        {
          title: 'Not Recommended Book',
          author: 'Not Recommended Author',
          year: '2023',
          recommended: false,
        },

        {
          title: 'Did Not Finish Book',
          author: 'Did Not Finish Author',
          year: '2023',
          finished: false,
        },
      ],
    ],
  ]),
}

const NO_AVATAR_TEST_DATA = {
  meta: {
    name: 'Test Name',
    feed: {
      title: 'Test Title',
      url: 'http://www.feedtest.com',
    },
  },
  sections: new Map([
    [
      2023,
      [
        {
          title: 'No Link Book',
          author: 'No Link Author',
          year: '2023',
        },
      ],
    ],
  ]),
}

describe('Feed Renderer', () => {
  describe('renderFeed()', () => {
    it('transforms the JSON without erroring', () => {
      expect(() => renderFeed(TEST_DATA)).not.toThrow()
    })

    describe('when transforming the JSON', () => {
      let feed

      beforeEach(() => {
        feed = renderFeed(TEST_DATA)
      })

      it('returns a well-formed JSON structure', () => {
        expect(feed).toHaveProperty('version')
        expect(feed).toHaveProperty('home_page_url')
        expect(feed).toHaveProperty('feed_url')
        expect(feed).toHaveProperty('items')
        expect(feed).toHaveProperty('title')
        expect(feed).toHaveProperty('icon')
      })

      it('outputs the items', () => {
        expect(feed.items.length).toBe(6)
      })

      describe('when there is no avatar URL configured', () => {
        beforeEach(() => {
          feed = renderFeed(NO_AVATAR_TEST_DATA)
        })

        it('does not include the avatar URL in the output', () => {
          expect(feed).not.toHaveProperty('icon')
        })
      })

      describe('when outputting a book item', () => {
        it('outputs the ID properly', () => {
          const book = feed.items[1]

          expect(book.id).toBe('No Link Book-No Link Author-2023')
        })

        it('outputs the title properly', () => {
          const book = feed.items[1]

          expect(book.title).toBe('No Link Book - No Link Author')
        })

        it('outputs the text content properly', () => {
          const book = feed.items[1]

          expect(book['content_text']).toBe('Read in 2023.')
        })

        describe('when there is a link present', () => {
          it('outputs the external URL', () => {
            const book = feed.items[2]

            expect(book['external_url']).toBe('http://www.test.com')
          })
        })

        describe('when there is not a link present', () => {
          it('does not output the external URL', () => {
            const book = feed.items[1]

            expect(book).not.toHaveProperty('external_url')
          })
        })

        describe('when there is a currently reading book', () => {
          let currentBook

          beforeEach(() => {
            currentBook = feed.items[0]
          })

          it('outputs the ID correctly', () => {
            expect(currentBook.id).toBe('Current Book-Current Author-current')
          })

          it('outputs the text content correctly', () => {
            expect(currentBook['content_text']).toBe('Currently reading.')
          })
        })

        describe('when a book is recommended', () => {
          it('outputs the text content properly', () => {
            const book = feed.items[3]

            expect(book['content_text']).toContain('Recommended.')
          })
        })

        describe('when a book is not recommended', () => {
          it('outputs the text content properly', () => {
            const book = feed.items[4]

            expect(book['content_text']).toContain('Not recommended.')
          })
        })

        describe('when a book was not finished', () => {
          it('outputs the text content properly', () => {
            const book = feed.items[5]

            expect(book['content_text']).toContain('Did not finish.')
          })
        })
      })
    })
  })
})
