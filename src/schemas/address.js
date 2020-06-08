import Joi from '@hapi/joi';

export default Joi.object({
    addressLine1: Joi.string().label('Address Line 1').required().min(4).max(50),
    addressLine2: Joi.string().label('Address Line 2').max(50),
    city: Joi.string().label('City').required().min(2).max(50),
    country: Joi.string().label('Country').required().min(2).max(20),
    postalCode: Joi.string().label('Postal code').required().min(2).max(10)
}).label('Address').required();
