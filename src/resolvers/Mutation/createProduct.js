import {Product} from "../../models/Product";
import {CreateProductValidator} from "../../schemas";
import { UserInputError } from "apollo-server-express"


export default async (_, {name, description, url, quantity, price, vat, associationId}) => {
    // Validation
    const validate = CreateProductValidator.validate({name, description, url, quantity, price, vat, associationId},
        {abortEarly: false});
    if(validate.error) {
        throw  new UserInputError( "Please provide the correct input data", {
            validationError : validate.error.details
        } );

    }
    const product = new Product({
        name,
        description,
        quantity,
        url,
        price,
        vat,
        associationId
    });
    await product.save();
    return product;
}
