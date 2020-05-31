import {Product} from "../models/Product";
import knex from "../sql"

export const resolvers = {
    Query: {
        products: async () => await Product.find(),
        product: async (parent, args, context, info) => await Product.findOne({_id: args.id}),
        invoices: async (parent, args, context, info) => await knex('invoice_shop').select("*")
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
