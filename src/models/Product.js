import mongoose from "mongoose";

const { Schema } = mongoose;


const ProductSchema = new Schema({
    name: String,
    description: String,
    url: String,
    price: Number,
    vat: Number,
    associationId: Number,
}, {timestamps: true});

export const Product = mongoose.model("Product", ProductSchema);
