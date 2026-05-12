import * as Joi from 'joi'

export const validationSchema = Joi.object({
    PORT: Joi.number().integer().min(1).max(65535).default(4000),
    CORS_ORIGIN: Joi.string().trim().required(),

    DATABASE_HOST: Joi.string().trim().required(),
    DATABASE_PORT: Joi.number().integer().min(1).max(65535).required(),
    DATABASE_USER: Joi.string().trim().required(),
    DATABASE_PASSWORD: Joi.string().allow('').required(),
    DATABASE_NAME: Joi.string().trim().required(),

    TELEGRAM_BOT_TOKEN: Joi.string().trim().required(),
    TELEGRAM_CHAT_ID: Joi.string().trim().required(),
    TELEGRAM_PROXY_URL: Joi.string().uri({ scheme: ['http', 'https'] }).optional().empty(''),

    THROTTLE_TTL_MS: Joi.number().integer().min(1000).default(60000),
    THROTTLE_LIMIT: Joi.number().integer().min(1).default(5),
})
