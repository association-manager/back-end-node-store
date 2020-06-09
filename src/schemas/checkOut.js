import Joi from '@hapi/joi';
import ProductValidator from './product'
import AddressValidator from './address'
import UserValidator from './user'

export default Joi.object().keys({
    user: UserValidator,
    address: AddressValidator,
    products: Joi.array().items(ProductValidator).label('Products').min(1).required(),
    totalVat: Joi.number().label('Total Vat').required(),
    totalAmount: Joi.number().label('Total Amount').required()
});
