import {contactFrontEmail} from '../Utils/sendEmail';

export default async (parent, data, {req}, info) => {
    console.log(data);
    let parameters = {}
    parameters.name = data.name;
    parameters.email = data.email;
    parameters.data = data;

    return contactFrontEmail(parameters)

}
