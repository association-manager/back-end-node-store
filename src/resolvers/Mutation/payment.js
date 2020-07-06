import stripe from "./Utils/stripe";

export default async (parent, args, {models}) => {
    let payment = {};
    payment.description = args.description
    payment.amount = args.amount * 100
    payment.currency = 'eur'
    payment.source = args.source
    let response;
    await stripe.charges.create(payment).then(async (result) => {
        console.log(result)
        response = true
    }).catch((err) => {
        console.log('Error');
        console.log(err);
        response = false;
        /*return {
            success: false,
            message: err.message,
            stack: err.stack,
        }*/
    });
    return response
}
