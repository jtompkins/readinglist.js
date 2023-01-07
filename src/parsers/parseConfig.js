import { parse } from 'toml'
import Joi from 'joi'

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

const parseConfig = (configStr) => {
  if (configStr === null || configStr === '') {
    throw new Error('A TOML string must be supplied')
  }

  const { error, value } = schema.validate(parse(configStr), schema)

  if (error) {
    throw error
  }

  return value
}

export default parseConfig
