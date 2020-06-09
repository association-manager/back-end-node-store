import bcrypt from "bcrypt";
import knex from "../../sql";
import {RegisterValidator} from "../../schemas";
import { UserInputError } from "apollo-server-express";


export default async (parent, args, {models}) => {
    const user = args;
    const validate = RegisterValidator.validate(user, {abortEarly: false});
    if(validate.error) {
        throw  new UserInputError( "Please provide the correct input data", {
            validationError : validate.error.details
        });
    }
    let findUser = await knex('user').select('email').where({email: user.email});
    if (findUser[0]) {
        return new UserInputError('User already Exit, please login by using your password')
    }

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
            data_usage_agreement: user.dataUsageAgreement

        }).then(async (result) => {
        return await knex('user').select('*').where({id: result})
            .then((a) => {
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
        console.log('Error');
        console.log(err);
        return {
            success: false,
            message: err.message,
            stack: err.stack,
        }
    });
}
