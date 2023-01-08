import { join } from 'path'
import { compileFile } from 'pug'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const getTemplatePath = (theme) => {
  return join(__dirname, '..', 'templates', `${theme}.pug`)
}

const getStylePath = (theme) => {
  return join(__dirname, '..', 'themes', `${theme}.css`)
}

const getOutputPath = (outputDir, file) => {
  return join(process.cwd(), outputDir, file)
}

const renderTemplate = (templatePath, context) => {
  return compileFile(templatePath, { pretty: true })(context)
}

export { getTemplatePath, getStylePath, getOutputPath, renderTemplate }
