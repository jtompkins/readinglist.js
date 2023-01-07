import Joi from 'joi'
import toml from 'toml'

const schema = Joi.object({
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
})

const parseConfig = (configStr) => {
  if (configStr === null || configStr === '') {
    throw new Error('A TOML string must be supplied')
  }

  const parsedToml = toml.parse(configStr)
  const { error, value } = schema.validate(parsedToml)

  if (error) {
    throw error
  }

  return value
}

export { parseConfig }
