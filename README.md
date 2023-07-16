# readinglist-js

A static site generator for your reading list

## Installation

`$ npm add readinglist-js`

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

#### JSON Feed Output

You can optionally have the generator also output a [JSON Feed](https://www.jsonfeed.org/) file by adding a `feed` key to the meta configuation. The `feed` object looks like this:

| Key         | Value                                                                                                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`     | A title for your feed. May be used by feed readers when displaying your feed. See the [JSON Feed spec](https://www.jsonfeed.org/version/1.1/) for more information.                                                                        |
| `url`       | The URL to your hosted JSON Feed output. Because this is used by feed readers for discovery, it must be a fully-qualified URL, and readinglist.js can't predict where you'll host the file, you have to provide it yourself.               |
| `avatarUrl` | _(Optional)_ The URL to an icon that represents your feed. This URL is used by feed readers to display your feed, and must be a fully-qualified URL. See the [JSON Feed spec](https://www.jsonfeed.org/version/1.1/) for more information. |

### The `book` object

The structure of the book object looks like this:

| Key           | Type      | Value                                                                                                                             |
| ------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | `string`  | The title of the book                                                                                                             |
| `author`      | `string`  | The author of the book                                                                                                            |
| `year`        | `int`     | The year you _read_ the book (**not** the year it was published). If `year` is set, `current` must _not_ be set.                  |
| `current`     | `boolean` | Set `current` to `true` to mark a book you're currently reading. If `current` is set, `year` must _not_ be set.                   |
| `link`        | `string`  | _(Optional)_ A link to the book's website or Amazon page. If provided, the book's title will be a link to this URL in the output. |
| `recommended` | `boolean` | _(Optional)_ If set to `true` or `false`, will mark a book as recommended (or not) in the output template. Ignored otherwise.     |
| `finished`    | `boolean` | _(Optional)_ If set to `false`, marks the book as "Did not Finish" in the output template. Ignored otherwise.                     |

### Running the generator

To generate your site, run the following command:

`npx reading-list -b <path to your books.json file> -o <path to your output directory>`

### Sample output

See [reading.joshtompkins.com](http://reading.joshtompkins.com) for a sample site running the `default` theme.

## Development

| Useful `yarn` Commands | Purpose                                                                                                                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `install`              | Installs local dependencies.                                                                                                                                                                                               |
| `test`                 | Runs local tests.                                                                                                                                                                                                          |
| `sample`               | Do a test run against the sample books file in the `test` directory, for local testing.                                                                                                                                    |
| `link`                 | Prepares this package to be installed locally for inclusion in other projects. In the other project, run `link readinglist-js` to install.                                                                                 |
| `global add $PWD`      | Installs this package globally to your system, allowing you to test the CLI. Note that the contents of the repo are _not watched_, so if you make changes, you'll need to run this command again.                          |
| `publish`              | Push the latest version of the package to the global NPM repository. You'll need credentials to do this. This command creates local git tags to mark the release version; don't forget to push these to the remote origin. |

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/jtompkins/readinglist.js.
