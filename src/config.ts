import * as Joi from 'joi'
import production from './production'
import development from './development'

interface Variable {
  [key: string]: any
}

let variable: Variable

export interface ProxyOptions {
  protocol: string
  host: string
  port: number
  auth: string
  urlRegex: string
}

// https://docs.nestjs.cn/6/techniques?id=%e9%aa%8c%e8%af%81-1
const validateInput = (vars: Variable): Variable => {
  const varsSchema: Joi.ObjectSchema = Joi.object({
    NODE_ENV: Joi.string()
      .valid(['development', 'production', 'test', 'provision'])
      .default('development'),

    HOST: Joi.string(),
    IGNORESITES: Joi.boolean()
      .optional()
      .default(false),

    PROXY_PROTOCOL: Joi.string().optional(),
    PROXY_HOST: Joi.string().optional(),
    PROXY_PORT: Joi.number().optional(),
    PROXY_AUTH: Joi.string().optional(),
    PROXY_URL_REGEX: Joi.string().optional(),
  })

  const { error, value: validatedVariables } = Joi.validate(vars, varsSchema)

  if (error) {
    throw new Error(`Config validation error: ${error.message}`)
  }

  return validatedVariables
}

switch (process.env.NODE_ENV || 'development') {
  case 'development':
    variable = validateInput(development)
    break
  case 'production':
    variable = validateInput(production)
    break
  default:
    throw new Error('config null')
}

export const host = (): string => {
  return variable.HOST
}

export const ignoreSites = (): boolean => {
  return variable.IGNORESITES
}

export const proxy = (): ProxyOptions => {
  return {
    protocol: variable.PROXY_PROTOCOL,
    host: variable.PROXY_HOST,
    port: +variable.PROXY_PORT,
    auth: variable.PROXY_AUTH,
    urlRegex: variable.PROXY_URL_REGEX || '.*',
  }
}

export const get = (key: string): any => {
  return variable[key]
}
