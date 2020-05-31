import {Product} from "../models/Product";

export const resolvers = {
    Query: {
        products: async () => await Product.find(),
        product: async (parent, args, context, info) => await Product.findOne({_id: args.id})
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
