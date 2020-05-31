import { Product } from "../models/Product";

export const resolvers = {
    Query: {
        products: () => Product.find()
    },
    Mutation: {
        createProduct: async (_, { name }) => {
            const product = new Product({ name });
            await product.save();
            return product;
        }
    }
};
