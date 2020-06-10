import Joi from '@hapi/joi';

export default Joi.object().keys({
    email: Joi.string().email().label('Email').required(),
    password: Joi.string().required().min(8).max(15).label('Password')
        .pattern( new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,15}$'))
});
