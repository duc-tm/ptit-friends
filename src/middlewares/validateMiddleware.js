const messageHandler = require('../helpers/handle-message');
const validationSchema = require('../utils/validator/ValidationSchema');
const {
    passwordSchema,
    emailSchema,
    registerSchema,
    loginSchema,
} = validationSchema;

function inputValidate(schema) {
    return (req, res, next) => {
        schema
            .validateAsync(req.body, { abortEarly: false })
            .then(() => {
                next();
            })
            .catch((errors) => {
                const msg = messageHandler.convertToObject(errors.details);
                msg.state = false;
                res.json(msg);
            });
    };
}

module.exports = {
    loginInputValidate: inputValidate(loginSchema),
    registerInputValidate: inputValidate(registerSchema),
};
