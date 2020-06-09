import bcrypt from "bcrypt";
import knex from "../../sql";


export default async (parent, args, {models}) => {
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
}
