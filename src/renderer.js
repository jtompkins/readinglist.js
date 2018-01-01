const path = require('path')
const pug = require('pug')

const getTemplatePath = theme => {
  return path.join(__dirname, '..', 'templates', `${theme}.pug`)
}

const getStylePath = theme => {
  return path.join(__dirname, '..', 'themes', `${theme}.css`)
}

const getOutputPath = (outputDir, file) => {
  return path.join(process.cwd(), outputDir, file)
}

const renderTemplate = (templatePath, context) => {
  return pug.compileFile(templatePath, { pretty: true })(context)
}

module.exports = {
  getTemplatePath,
  getStylePath,
  getOutputPath,
  renderTemplate,
}
