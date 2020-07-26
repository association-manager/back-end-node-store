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
        subject: "Réinitialisation de votre mot de passe",
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

export const contactFrontEmail = async (parameters) => {
    return await nodeMailerMailGun.sendMail({
        from: 'noreplay@associationmanager.com',
        to: 'hasana.ali@gmail.com', // An array if you have multiple recipients.
        subject: "Nouvelle demande de contact de "+ parameters.name,
        template: {
            name: path.join(__dirname, './../../../emailTemplate/contactFront.hbs'),
            engine: 'handlebars',
            context: {
                email: parameters.data.email,
                name: parameters.data.name.replace(/<[^>]+>|\s/g, ' '),
                subject: parameters.data.subject.replace(/<[^>]+>|\s/g, ' '),
                message: parameters.data.message.replace(/<[^>]+>|\s/g, ' '),

            }
        }
    })
        .then(async (info) => {
            console.log('Response: ' + JSON.stringify(info));
            let emailToVisitor = await contactFrontVisitor(parameters);
            if(!emailToVisitor.status) return emailToVisitor;
            return (info.id ) ? {status: true, code: 200, message: "email send sucessfuly"} : {
                status: false,
                code: 444,
                message: "Error while send request Email send to client"}
        })
        .catch((err) => {
            console.log('Response: ' + JSON.stringify(err));
            console.log('message: Error while send request Email send to client');
            return {status: false, code: 503, message: "Error while send request Email send to client"};
        });
};

const contactFrontVisitor = async (parameters) => {
    return await nodeMailerMailGun.sendMail({
        from: 'noreplay@associationmanager.com',
        to: parameters.data.email, // An array if you have multiple recipients.
        subject: "Accusé de réception de votre demande d'contact",
        template: {
            name: path.join(__dirname, './../../../emailTemplate/contactFrontVisitor.hbs'),
            engine: 'handlebars',
            context: {
                email: parameters.data.email,
                name: parameters.data.name.replace(/<[^>]+>|\s/g, ' ')
            }
        }
    })
        .then((info) => {
            console.log('Response: ' + JSON.stringify(info));
            return (info.id ) ? {status: true, code: 200, message: "email send sucessfuly"} : {
                status: false,
                code: 444,
                message: "Error while send request Email send to client"}
        })
        .catch((err) => {
            console.log('Response: ' + JSON.stringify(err));
            console.log('message: Error while send request Email send to Visitor');
            return {status: false, code: 503, message: "Error while send request Email send to Visitor"};
        });
};

