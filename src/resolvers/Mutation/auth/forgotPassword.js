import {forgotPasswordValidator} from "../../../schemas";
import knex from "../../../sql";
import {forgotPasswordEmail} from "../Utils/sendEmail";


export default async (parent, {email}) => {
    console.log(email);
    const validate = forgotPasswordValidator.validate({email}, {abortEarly: false});
    if(validate.error) {
        let error = {
            code: 401,
            message: validate.error.details
        };
        throw  new Error(JSON.stringify(error));

    }
    const user = await knex('user').select("*").where({email: email});
    if (user.length === 0) {
        throw new Error('No user found');
    }

    if(!user[0].roles.includes('ROLE_SHOPPING')) {
        throw new Error('You are not a valid user to reset the password, please contact Administrator');
    }
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 19; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }

    await knex('user')
        .where({ email: email })
        .update({ password_reset_token: token })
    let parameter = {};
    parameter.email = email;
    parameter.name = user[0].first_name + ' ' +user[0].last_name;
    parameter.token = token;
    return await forgotPasswordEmail(parameter);
}
