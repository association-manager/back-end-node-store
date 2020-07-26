import {contactFrontEmail} from '../Utils/sendEmail';
import {contactFrontValidator} from "../../../schemas";
import {errorMessage} from "../Utils/errorMessageFormat";

export default async (parent, data, {req}, info) => {
    const validate = await contactFrontValidator.validate(data,
        {abortEarly: false});
    if(validate.error) {
        return {message: errorMessage(validate), status: false, code: 406 };
    }
    let parameters = {}
    parameters.data = data;
    return contactFrontEmail(parameters)
}
