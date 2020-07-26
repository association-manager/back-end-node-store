import {contactFrontEmail} from '../Utils/sendEmail';
import {contactFrontValidator} from "../../../schemas";
import {UserInputError} from "apollo-server-express";

export default async (parent, data, {req}, info) => {
    const validate = contactFrontValidator.validate(data,
        {abortEarly: false});
    console.log(validate);
    if(validate.error) {
        return {status: false, code: 406, message: "Please provide the correct input data" };
    }
    console.log(data);
    let parameters = {}
    parameters.data = data;

    return contactFrontEmail(parameters)

}
