import Joi from '@hapi/joi';

export default Joi.object().keys({
    email: Joi.string().email().label('Email').required()
});
