const renderFeed = (context) => {
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    home_page_url: context.meta.website,
    feed_url: context.meta.feed.url,
  }

  if (context.meta.feed.title) {
    feed.title = context.meta.feed.title
  }

  if (context.meta.feed.avatarUrl) {
    feed.icon = context.meta.feed.avatarUrl
  }

  let items = []

  Array.from(context.sections.values()).forEach((books) => {
    books.forEach((book) => {
      const feedBook = {
        id: `${book.title}-${book.author}-${
          book.current ? 'current' : book.year
        }`,
        title: `${book.title} - ${book.author}`,
      }

      if (book.link) {
        feedBook['external_url'] = book.link
      }

      let description = book.current
        ? `Currently reading.`
        : `Read in ${book.year}.`

      if (book.recommended === true) {
        description += ' Recommended.'
      } else if (book.recommended === false) {
        description += ' Not recommended.'
      }

      if (book.finished === false) {
        description += ' Did not finish.'
      }

      feedBook['content_text'] = description

      items.push(feedBook)
    })
  })

  feed.items = items

  return feed
}

export { renderFeed }
