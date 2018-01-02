# readinglist.js

A static site generator for your reading list

## Installation

`$ yarn add --global readinglist.js`

## Usage

To generate your reading list website, you'll need two files: a TOML `config` file and a JSON `book` file.

### The Config file

The basic structure of the config file looks like this:

```
[meta]
name: YOUR_NAME
email: YOUR_EMAIL
website: YOUR_WEBSITE

[output]
dir: OUTPUT_DIRECTORY
theme: default
```

| Key       | Value                                                                                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`    | Your name. Displayed in the header of the generated site.                                                                                                               |
| `email`   | _(Currently unused)_ Your email address.                                                                                                                                |
| `website` | _(Currently unused)_ Your website.                                                                                                                                      |
| `dir`     | The _relative_ path to the output directory. The generated HTML and CSS files will be written there. **Caution**: Any existing HTML and CSS output will be overwritten. |
| `theme`   | The name of the theme for your site. The only supported value (at least for now) is `default`.                                                                          |

All of the values are required.

### The Book file

The book file is a JSON file containing an array of JSON objects. The structure looks like this:

```
[
  {
    "title": "The Lion, the Witch, and the Wardrobe",
    "author": "C. S. Lewis",
    "year": 2017,
    "link": "https://www.amazon.com/Lion-Witch-Wardrobe-Chronicles-Narnia/dp/0064404994/"
  },

  {
    // etc
  }
]
```

| Key      | Type     | Value                                                                                                                             |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `title`  | `string` | The title of the book                                                                                                             |
| `author` | `string` | The author of the book                                                                                                            |
| `year`   | `int`    | The year you _read_ the book (**not** the year it was published)                                                                  |
| `link`   | `string` | _(Optional)_ A link to the book's website or Amazon page. If provided, the book's title will be a link to this URL in the output. |

### Running the generator

To generate your site, run the following command in the directory where `config.toml` and `books.json` live:

`readinglist`

### Sample output

See [reading.joshtompkins.com](http://reading.joshtompkins.com) for a sample site running the `default` theme.

## Development

After checking out the repo, run `yarn install` to install dependencies. Then, run `yarn test` to run the tests.

To install this gem onto your local machine, run `yarn link`. To release a new version, run `yarn publish`, which will create a git tag for the version and push the new version to NPM. Don't forget to push the new tags to your git remote!

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/jtompkins/readinglist.js.
