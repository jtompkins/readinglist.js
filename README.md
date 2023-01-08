# readinglist-js

A static site generator for your reading list

## Installation

`$ yarn global add readinglist-js`

## Usage

To generate your reading list website, you'll need two files: a TOML `config.toml` file and a JSON `book.json` file. To display an avatar image in the rendered static site, you'll also need to provide an `avatar.png` file, which should live in the same directory as the generated output.

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

`reading-list`

### Sample output

See [reading.joshtompkins.com](http://reading.joshtompkins.com) for a sample site running the `default` theme.

## Development

| Command                | Purpose                                                                                                                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yarn install`         | Installs local dependencies.                                                                                                                                                                                               |
| `yarn test`            | Runs local tests.                                                                                                                                                                                                          |
| `yarn testWithDebug`   | Sets up node for VS Code debugging. Probably not necessary now that VS Code has built-in Node debugging support.                                                                                                           |
| `yarn compileSass`     | When the package is installed globally, it expects a `.css` file to power the theme, but the development styles are SASS. Run this command to compile the SASS styles to vanilla CSS.                                      |
| `yarn link`            | Prepares this package to be installed locally for inclusion in other projects. In the other project, run `yarn link readinglist-js` to install.                                                                            |
| `yarn global add $PWD` | Installs this package globally to your system, allowing you to test the CLI. Note that the contents of the repo are _not watched_, so if you make changes, you'll need to run this command again.                          |
| `yarn publish`         | Push the latest version of the package to the global NPM repository. You'll need credentials to do this. This command creates local git tags to mark the release version; don't forget to push these to the remote origin. |

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/jtompkins/readinglist.js.
