const toml = require('toml')
const Joi = require('joi')

const schema = {
  meta: Joi.object()
    .keys({
      name: Joi.string().required(),
      email: Joi.string(),
      website: Joi.string(),
    })
    .required(),
  output: Joi.object()
    .keys({
      dir: Joi.string().default('.'),
      theme: Joi.string().default('default'),
    })
    .required(),
}

const parseConfig = configStr => {
  if (configStr === null || configStr === '') {
    throw new Error('A TOML string must be supplied')
  }

  const { error, value } = Joi.validate(toml.parse(configStr), schema)

  if (error) {
    throw error
  }

  return value
}

module.exports = parseConfig
