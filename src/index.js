#! /usr/bin/env node

import { readFileSync, writeFileSync, copyFileSync } from 'fs'
import { Command } from 'commander'
import figlet from 'figlet'
import colors from 'colors'

import { parseBooks } from './parsers/parseBooks.js'

import {
  getTemplatePath,
  getStylePath,
  getOutputPath,
  renderTemplate,
} from './renderer.js'

const program = new Command()

program
  .name('readinglist-js')
  .description('A CLI to generate a static reading list website')
  .version('2.0-alpha.1')

program
  .requiredOption(
    '-b, --books <path>',
    'The relative path to the books.json file',
    // './books.json',
  )
  .requiredOption(
    '-o, --output-dir <path>',
    'The relative directory path where readinglist-js will write its output',
    // './',
  )
  .option('-q, --quiet', 'Do not log output to the console')
  .option('-n, --no-styles', 'Do not overwrite styles during generation')

program.parse()

const opts = program.opts()

if (!opts.quiet) {
  console.log(
    '\n',
    colors.brightGreen(
      figlet.textSync('readinglist.js', {
        font: '3D-ASCII',
      }),
    ),
  )
}

if (!opts.quiet) {
  console.log(
    `${colors.brightGreen('✔')} Reading books file at ${colors.brightBlue(
      opts.books,
    )}...`,
  )
}

const books = parseBooks(readFileSync(opts.books))
const renderedTemplate = renderTemplate(
  getTemplatePath(books.meta.theme),
  books,
)

if (!opts.quiet) {
  console.log(
    `${colors.brightGreen(
      '✔',
    )} Writing HTML and CSS files to output directory at ${colors.brightBlue(
      opts.outputDir,
    )}...`,
  )
}

writeFileSync(getOutputPath(opts.outputDir, 'index.html'), renderedTemplate)

if (opts.styles) {
  copyFileSync(
    getStylePath(books.meta.theme),
    getOutputPath(opts.outputDir, 'styles.css'),
  )
}

if (!opts.quiet) {
  console.log(`✨ Done!\n`)
}
