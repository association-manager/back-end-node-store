import {Product} from "../../models/Product";
import {CreateProductValidator} from "../../schemas";
import { UserInputError } from "apollo-server-express"


export default async (_, {
    name,
    description,
    mainImageUrl,
    mainThumbnailUrl,
    images,
    quantity,
    price,
    vat,
    associationId
}, {req}) => {
    // Verification of user role
    if(!req.isAuth) {
        return new Error('Unauthenticated process');
    }
    if(!(req.userRole).includes('ROLE_USER')) {
        return new Error('Unauthenticated user to create product')
    }
    // Validation
    const validate = CreateProductValidator.validate({
            name,
            description,
            mainImageUrl,
            mainThumbnailUrl,
            images,
            quantity,
            price,
            vat,
            associationId
        },
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
        mainImageUrl,
        mainThumbnailUrl,
        images,
        price,
        vat,
        associationId
    });
    await product.save();
    return product;
}
