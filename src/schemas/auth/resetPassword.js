import Joi from '@hapi/joi';

export default Joi.object().keys({
    token: Joi.string().label('Token').required(),
    password: Joi.string().required().min(8).max(15).label('Password')
        .pattern( new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,15}$'))
});
