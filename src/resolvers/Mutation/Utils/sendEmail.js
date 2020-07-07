import nodeMailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import path from 'path';
import dotenv  from 'dotenv';
dotenv.config();
require('handlebars');
const auth = {
    auth: {
        api_key: process.env.MAIL_GUN_API_KEY,
        domain: process.env.MAIL_GUN_DOMAIN
    }
};
const nodeMailerMailGun = nodeMailer.createTransport(mg(auth));


export const forgotPasswordEmail = async (parameters) => {
    return await nodeMailerMailGun.sendMail({
        from: 'noreplay@associationmanager.com',
        to: parameters.email, // An array if you have multiple recipients.
        subject: "Email for your reset password request",
        template: {
            name: path.join(__dirname, './../../../emailTemplate/forgotPassword.hbs'),
            engine: 'handlebars',
            context: {
                email: parameters.email,
                name: parameters.name,
                token: parameters.token
            }
        }
    })
        .then((info) => {
            console.log('Response: ' + JSON.stringify(info));
            return true
        })
        .catch((err) => {
        console.log('Response: ' + JSON.stringify(err));
        console.log('message: Error while send reset password request email');
        return false;
    });
};
