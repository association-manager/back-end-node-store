import {Product} from "../models/Product";
import knex from "../sql"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import dotenv from 'dotenv';
import Joi from '@hapi/joi';
import { CheckOutValidator} from "../schemas";

dotenv.config();

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
        },
        register: async (parent, args, {models}) => {
            const user = args;
            user.password = await bcrypt.hash(user.password, 12);

            return await knex('user').insert(
                {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    mobile: user.mobile,
                    password: user.password,
                    roles: "['ROLE_SHOPPING']",
                    created_at: new Date(),
                    data_usage_agreement: 0

                }).then(async (result) => {
                return await knex('user').select('*').where({id: result})
                    .then((a) => {
                        console.log(a[0].id);
                        return a[0];
                    }).catch((err) => {
                        console.log(err);
                        return {
                            success: false,
                            message: err.message,
                            stack: err.stack,
                        }
                    });
            }).catch((err) => {
                console.log(err);
                return {
                    success: false,
                    message: err.message,
                    stack: err.stack,
                }
            });
        },
        login: async (parent, {email, password}) => {
            const user = await knex('user').select("*").where({email: email});
            if (!user[0].email === email) {
                throw new Error('Not user with that email');
            }
            const valid = await bcrypt.compare(password, user[0].password);
            if (!valid) {
                throw new Error('Incorrect password');
            }

            // token = '12083098123414aslkjdasldf.asdhfaskjdh12982u793.asdlfjlaskdj10283491'
            // verify: needs secret | use me for authentication
            // decode: no secret | use me on the client side
            const token = jwt.sign(
                {
                    user: _.pick(user, ['id', 'username']),
                },
                process.env.SECERT,
                {
                    expiresIn: '1y',
                },
            );

            return token;
        },
        createSale: async (parent, {data}, context, info) => {
            // Validation
            const {value, error} = CheckOutValidator.validate(data, {abortEarly: false});
            // reduce product (Update the quantity of product)
            console.log(value);
            console.log(error);

            let products = data.products;
            if(products !== []) {
               await products.map(async (product)=> {
                    let p = await Product.findOne({_id: product.id});
                    let newQuantity = parseInt(p.quantity) - parseInt(product.quantity);
                    await Product.updateOne({_id: product.id }, {quantity:newQuantity});
               })
            }
            // create Invoice
            let invoiceId = await knex('invoice_shop').insert({
                data: JSON.stringify(data),
                created_at: new Date(),
                vat: data.totalVat,
                amount: data.totalAmount
            });
            // Create Address
            let addressId = data.address.id;

            if (!addressId && invoiceId[0] !== null) {
                let address = await knex('address').insert({
                    address_line1: data.address.addressLine1,
                    address_line2: data.address.addressLine2,
                    invoice_shop_id: invoiceId[0],
                    city: data.address.city,
                    postal_code: data.address.postalCode,
                    country: "france"
                });
            }
            // Get Invoice
            let invoice =  await knex('invoice_shop').select('*').where({id: invoiceId});
            if (invoice[0]) {
                invoice[0].data = JSON.parse(invoice[0].data);
            }
            return invoice[0];
        },
    }
};
