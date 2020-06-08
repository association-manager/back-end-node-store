import Joi from '@hapi/joi';

export default Joi.object({
    id: Joi.number().integer().label('User id').required(),
    first_name: Joi.string().label('Address Line 1').required().min(4).max(50),
    last_name: Joi.string().label('Address Line 1').required().min(4).max(50),
    mobile: Joi.number().label('Mobile N°').required(),
    email: Joi.string().email().label('Email').required()
});
