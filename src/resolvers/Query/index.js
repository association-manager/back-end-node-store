import {Product} from "../../models/Product";
import knex from "../../sql";

export default {
    products: async () => await Product.find(),
    product: async (parent, args, context, info) => await Product.findOne({_id: args.id}),
    invoices: async (parent, args, context, info) => await knex('invoice_shop').select("*")
}
