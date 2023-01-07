#! /usr/bin/env node

import fs from 'fs'
import util from 'util'

import { parseBooks } from './parsers/parseBooks.js'
import { parseConfig } from './parsers/parseConfig.js'

import {
  getTemplatePath,
  getStylePath,
  getOutputPath,
  renderTemplate,
} from './renderer.js'

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
