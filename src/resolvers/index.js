import {Product} from "../models/Product";

export const resolvers = {
    Query: {
        products: () => Product.find()
    },
    Mutation: {
        createProduct: async (_, {
            name,
            description,
            url,
            price,
            vat,
            associationId
        }) => {
            const product = new Product({
                name,
                description,
                url,
                price,
                vat,
                associationId
            });
            await product.save();
            return product;
        }
    }
};
