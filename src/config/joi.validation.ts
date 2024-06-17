import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_HOST: Joi.string().required().default('localhost'),
    DB_PORT: Joi.number().required().default(5432),
    DB_USERNAME: Joi.string().required().default('postgres'),

    PORT: Joi.number().required().default(3000),

    JWT_SECRET: Joi.string().required(),
});