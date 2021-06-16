const joi = require('joi');

const usernameSchema = joi
    .string()
    .min(4)
    .trim()
    .lowercase()
    .required()
    .messages({
        'string.min': 'username:At least 4 characters',
        'string.empty': 'username:Username is required',
    });

const passwordSchema = joi
    .string()
    .min(4)
    // .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u)
    .required()
    .messages({
        'string.min': 'password:At least 8 characters',
        'string.pattern.base':
            'password:Contain uppercase, lowercase characters and number',
        'string.empty': 'password:Password is required',
    });

const emailSchema = joi
    .string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
        'string.email': 'email:Email invalid',
        'string.empty': 'email:Email is required',
    });

const registerSchema = joi.object({
    username: usernameSchema,
    password: passwordSchema,
    repassword: joi.valid(joi.ref('password')).required(),
    email: emailSchema,
});

const loginSchema = joi.object({
    username: usernameSchema,
    password: passwordSchema,
});

module.exports = {
    passwordSchema,
    emailSchema,
    registerSchema,
    loginSchema,
};
