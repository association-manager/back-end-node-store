import {Product} from "../../models/Product";


export default async (_, {
    name,
    description,
    url,
    quantity,
    price,
    vat,
    associationId
}) => {
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
