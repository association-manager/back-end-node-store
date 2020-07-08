import { CreateSaleValidator } from "../../schemas";
import { Product } from "../../models/Product";
import knex from "../../sql";
import { UserInputError } from "apollo-server-express";


export default async (parent, {data}, {req}, info) => {
    if(!req.isAuthCart) {
        return new Error('UnAuthorized access')
    }
    // Validation
    const validate = CreateSaleValidator.validate(data, {abortEarly: false});
    console.log(validate.error.details);
    if(validate.error) {
        throw  new UserInputError( "Please provide the correct input data", {
            validationError : validate.error.details
        } );

    }
    // reduce product (Update the quantity of product)

    let products = data.products;
    if(products !== []) {
        await products.map(async (product)=> {
            let p = await Product.findOne({_id: product.id});
            let newQuantity = parseInt(p.quantity) - parseInt(product.quantity);
            await Product.updateOne({_id: product.id }, {quantity:newQuantity});
        })
    }
    // create Invoice
    let invoiceId = await knex('invoice_shop').insert({
        data: JSON.stringify(data),
        created_at: new Date(),
        vat: data.totalVat,
        amount: data.totalAmount
    });
    // Create Address
    let addressId = data.address.id;

    if (!addressId && invoiceId[0] !== null) {
        let address = await knex('address').insert({
            address_line1: data.address.addressLine1,
            address_line2: data.address.addressLine2,
            invoice_shop_id: invoiceId[0],
            city: data.address.city,
            postal_code: data.address.postalCode,
            country: "france"
        });
    }
    // Get Invoice
    let invoice =  await knex('invoice_shop').select('*').where({id: invoiceId});
    if (invoice[0]) {
        invoice[0].data = JSON.parse(invoice[0].data);
    }
    return invoice[0];
}
