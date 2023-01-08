# readinglist-js

A static site generator for your reading list

## Installation

`$ yarn global add readinglist-js`

## Usage

To generate your reading list website, you'll need a JSON `book.json` file. To display an avatar image in the rendered static site, you'll also need to provide an `avatar.png` file, which should live in the same directory as the generated output.

## The Book file

The book file is a JSON file with two keys: a `meta` key, containing an object with configuration options, and a `books` key, containing an array of JSON objects. The structure should look like this:

```
{
  "meta": {
    ...
  },
  "books": [
    ...
  ]
}
```

### The `meta` Object

The structure of the `meta` object looks like this:

| Key       | Value                                                     |
| --------- | --------------------------------------------------------- |
| `name`    | Your name. Displayed in the header of the generated site. |
| `email`   | _(Currently unused)_ Your email address.                  |
| `website` | _(Currently unused)_ Your website.                        |

All of the values are required.

#### The `book` object

The structure of the book object looks like this:

| Key       | Type      | Value                                                                                                                             |
| --------- | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `title`   | `string`  | The title of the book                                                                                                             |
| `author`  | `string`  | The author of the book                                                                                                            |
| `year`    | `int`     | The year you _read_ the book (**not** the year it was published). If `year` is set, `current` must _not_ be set.                  |
| `current` | `boolean` | Set `current` to `true` to mark a book you're currently reading. If `current` is set, `year` must _not_ be set.                   |
| `link`    | `string`  | _(Optional)_ A link to the book's website or Amazon page. If provided, the book's title will be a link to this URL in the output. |

### Running the generator

To generate your site, run the following command:

`reading-list -b <path to your books.json file, defaults to ./books.json> -o <path to your output directory, defaults to current>`

### Sample output

See [reading.joshtompkins.com](http://reading.joshtompkins.com) for a sample site running the `default` theme.

## Development

| Useful `yarn` Commands | Purpose                                                                                                                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `install`              | Installs local dependencies.                                                                                                                                                                                               |
| `test`                 | Runs local tests.                                                                                                                                                                                                          |
| `sample`               | Do a test run against the sample books file in the `test` directory, for local testing.                                                                                                                                    |
| `compileSass`          | When the package is installed globally, it expects a `.css` file to power the theme, but the development styles are SASS. Run this command to compile the SASS styles to vanilla CSS.                                      |
| `link`                 | Prepares this package to be installed locally for inclusion in other projects. In the other project, run `link readinglist-js` to install.                                                                                 |
| `global add $PWD`      | Installs this package globally to your system, allowing you to test the CLI. Note that the contents of the repo are _not watched_, so if you make changes, you'll need to run this command again.                          |
| `publish`              | Push the latest version of the package to the global NPM repository. You'll need credentials to do this. This command creates local git tags to mark the release version; don't forget to push these to the remote origin. |

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/jtompkins/readinglist.js.
