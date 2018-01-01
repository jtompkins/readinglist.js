const parseConfig = require('./parseConfig')

const GOOD_CONFIG = `
  [meta]
  name = "Dudly McTesterson"
  email = "dudly@mctesterson.org"
  website = "http://dudly.mctesterson.org"

  [output]
  dir = "."
  theme = "default"
`

const MISSING_VALUES_WITH_DEFAULTS = `
  [meta]
  name = "Dudly McTesterson"
  email = "dudly@mctesterson.org"
  website = "http://dudly.mctesterson.org"

  [output]
`

const MISSING_REQUIRED_VALUES = `
  [meta]
  email = "dudly@mctesterson.org"
  website = "http://dudly.mctesterson.org"

  [output]
  dir = "."
  theme = "default"
`

const MISSING_TOP_LEVEL_KEYS = `
  name = "Dudly McTesterson"
  email = "dudly@mctesterson.org"
  website = "http://dudly.mctesterson.org"
  dir = "."
  theme = "default"
`

describe('parseConfig', async () => {
  it('parse a TOML string', () => {
    const toml = parseConfig(GOOD_CONFIG)
    expect(toml).toBeInstanceOf(Object)
  })

  it('fills in required values with well-defined defaults', () => {
    const toml = parseConfig(MISSING_VALUES_WITH_DEFAULTS)

    expect(toml.output.dir).toEqual('.')
    expect(toml.output.theme).toEqual('default')
  })

  describe('when the input is not well-formed', () => {
    it('throws when the TOML string is empty', () => {
      expect(() => parseConfig('')).toThrow()
    })

    it('throws when the top-level keys are missing', () => {
      expect(() => parseConfig(MISSING_TOP_LEVEL_KEYS)).toThrow()
    })

    it('throws when the TOML is missing required keys', () => {
      expect(() => parseConfig(MISSING_REQUIRED_VALUES)).toThrow()
    })
  })
})
