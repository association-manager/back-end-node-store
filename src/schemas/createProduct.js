import Joi from '@hapi/joi';

export default Joi.object({
    name: Joi.string().label('Product Name').required().min(2).max(50),
    description: Joi.string().label('Description').required().min(4),
    mainImageUrl: Joi.string().uri().label('mainImageUrl').required(),
    mainThumbnailUrl: Joi.string().uri().label('mainThumbnailUrl').required(),
    quantity: Joi.number().label('Quantity').required(),
    price: Joi.number().label('Price').required().max(10000),
    vat: Joi.number().label('Value Added Tax').required().max(30),
    images: Joi.array().items(Joi.string().uri()).label('images').required(),
    associationId: Joi.number().integer().label('Association Id').required()
});
