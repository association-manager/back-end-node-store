import {Product} from "../models/Product";
import knex from "../sql"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

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
        login: async (parent, {email, password}, {models, SECRET}) => {
            const user = await knex('user').select("*").where({email: email});
            if (!user) {
                throw new Error('Not user with that email');
            }

            const valid = await bcrypt.compare(password, user.password);
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
                SECRET,
                {
                    expiresIn: '1y',
                },
            );

            return token;
        },
    }
};
