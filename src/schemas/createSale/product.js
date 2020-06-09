import Joi from '@hapi/joi';

export default Joi.object({
    id: Joi.string().label('Product id').required(),
    name: Joi.string().label('Product Name').required().min(2).max(50),
    description: Joi.string().label('Description').required().min(4),
    url: Joi.string().uri().label('URL').required(),
    quantity: Joi.number().label('Quantity').required(),
    price: Joi.number().label('Price').required().max(10000),
    vat: Joi.number().label('Value Added Tax').required().max(30),
    associationId: Joi.number().integer().label('Association Id').required()
});
