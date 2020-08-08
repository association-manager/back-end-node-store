import {forgotPasswordValidator} from "../../../schemas";
import knex from "../../../sql";
import {forgotPasswordEmail} from "../Utils/sendEmail";
import bcrypt from "bcrypt";


export default async (parent, {email}) => {
    console.log('forgotPassword');
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

    /*let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 9; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }*/
    let generatedPassword = (lettersLength,numbersLength, symbolsLength) => {
        let j, x, i;
        let result           = '';
        let smallLetter       = 'abcdefghijklmnopqrstuvwxyz';
        let capitalLetter       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let numbers       = '0123456789';
        let symbols       = '~!@-#$';
        for (i = 0; i < lettersLength; i++ ) {
            result += smallLetter.charAt(Math.floor(Math.random() * smallLetter.length));
            result += capitalLetter.charAt(Math.floor(Math.random() * capitalLetter.length));
        }
        for (i = 0; i < numbersLength; i++ ) {
            result += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        for (i = 0; i < symbolsLength; i++ ) {
            result += symbols.charAt(Math.floor(Math.random() * symbols.length));
        }
        result = result.split("");
        for (i = result.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = result[i];
            result[i] = result[j];
            result[j] = x;
        }
        result = result.join("");
        return result
    }

    console.log('generatedPassword');
    console.log(generatedPassword(5,1, 2));

    let password = await bcrypt.hash(generatedPassword(5,1, 2), 12);
    password.replace('$2a$', '$2y$')
    password.replace('$2b$', '$2y$')

    await knex('user')
        .where({ email: email })
        .update({ password: password })
    let parameter = {};
    parameter.email = email;
    parameter.name = user[0].first_name + ' ' +user[0].last_name;
    parameter.token = generatedPassword(5,1, 2);
    return await forgotPasswordEmail(parameter);
}
