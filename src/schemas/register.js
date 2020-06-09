import Joi from '@hapi/joi';

export default Joi.object({
    first_name: Joi.string().label('First Name').required().min(4).max(50),
    last_name: Joi.string().label('Last Name').required().min(4).max(50),
    mobile: Joi.number().label('Mobile N°').required(),
    email: Joi.string().email().label('Email').required(),
    password: Joi.string().required().min(8).max(15).label('Password')
        .pattern( new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,15}$')),
    dataUsageAgreement: Joi.number().label('Data usage agreement').max(1).required()
});
