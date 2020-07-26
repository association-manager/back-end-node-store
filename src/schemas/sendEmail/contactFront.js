import Joi from '@hapi/joi';

export default Joi.object({
    name: Joi.string().label('Nom').required().min(2).max(50),
    subject: Joi.string().label('Subject').required().min(2).max(50),
    message: Joi.string().label('Message').required().min(2).max(1000),
    email: Joi.string().email().label('Email').required(),
});
