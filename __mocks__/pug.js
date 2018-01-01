const mockTemplateRenderer = jest.fn()
const mockCompileFile = jest.fn(templatePath => mockTemplateRenderer)

module.exports = {
  mockTemplateRenderer,
  mockCompileFile,
  compileFile: mockCompileFile,
}
