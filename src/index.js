#! /usr/bin/env node

const fs = require('fs')
const util = require('util')

const parseBooks = require('./parsers/parseBooks')
const parseConfig = require('./parsers/parseConfig')
const {
  getTemplatePath,
  getStylePath,
  getOutputPath,
  renderTemplate,
} = require('./renderer')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const copyFile = util.promisify(fs.copyFile)

const run = async () => {
  const { meta, output } = parseConfig(await readFile('./config.toml'))
  const books = parseBooks(await readFile('./books.json'))
  const renderedTemplate = renderTemplate(getTemplatePath(output.theme), {
    config: meta,
    books,
  })

  const outputRenderPath = getOutputPath(output.dir, 'index.html')
  await writeFile(outputRenderPath, renderedTemplate)

  const outputStylePath = getOutputPath(output.dir, 'styles.css')
  await copyFile(getStylePath(output.theme), outputStylePath)
}

run()
