import {resetPasswordValidator} from "../../../schemas";
import knex from "../../../sql";
import bcrypt from "bcrypt";


export default async (parent, {token, password}) => {
    const validate = resetPasswordValidator.validate({token, password}, {abortEarly: false});
    if(validate.error) {
        let error = {
            code: 401,
            message: validate.error.details
        };
        throw  new Error(JSON.stringify(error));

    }
    const user = await knex('user').select("*").where({password_reset_token: token});
    if (user.length === 0) {
        throw new Error('Your token is invalid, Please regenerate it');
    }
    password = await bcrypt.hash(password, 12);

    await knex('user')
        .where({ email: user[0].email })
        .update({ password: password,  password_reset_token: null})
    return true;
}
