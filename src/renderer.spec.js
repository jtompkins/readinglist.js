const path = require('path')
const { getTemplatePath, getStylePath, renderTemplate } = require('./renderer')
const { mockCompileFile, mockTemplateRenderer } = require('pug')

const TEMPLATE_PATH = '/path/to/template'
const TEST_CONTEXT = { config: {}, books: [] }

describe('Render utils', () => {
  describe('getTemplatePath', () => {
    it('returns the path to the template in the module', () => {
      const templatePath = getTemplatePath('default')

      const realTemplatePath = path.join(
        process.cwd(),
        'templates',
        'default.pug',
      )

      expect(templatePath).toEqual(realTemplatePath)
    })
  })

  describe('getStylePath', () => {
    it('returns the path to the CSS theme in the module', () => {
      const stylePath = getStylePath('default')
      const realStylePath = path.join(process.cwd(), 'themes', 'default.css')

      expect(stylePath).toEqual(realStylePath)
    })
  })

  describe('renderTemplate', () => {
    beforeEach(() => {
      mockTemplateRenderer.mockReset()
    })

    it('loads the Pug template', () => {
      renderTemplate(TEMPLATE_PATH, TEST_CONTEXT)

      expect(mockCompileFile).toHaveBeenCalledWith(
        TEMPLATE_PATH,
        expect.any(Object),
      )
    })

    it('calls the template renderer', () => {
      renderTemplate(TEMPLATE_PATH, TEST_CONTEXT)

      expect(mockTemplateRenderer).toHaveBeenCalled()
    })

    it('passes the context to the renderer', () => {
      renderTemplate(TEMPLATE_PATH, TEST_CONTEXT)

      expect(mockTemplateRenderer).toHaveBeenCalledWith(TEST_CONTEXT)
    })
  })
})
