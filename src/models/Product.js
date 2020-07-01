import mongoose from "mongoose";

const { Schema } = mongoose;


const ProductSchema = new Schema({
    name: String,
    description: String,
    mainImageUrl: String,
    mainThumbnailUrl: String,
    quantity: Number,
    price: Number,
    vat: Number,
    images: Array,
    associationId: Number,
}, {timestamps: true});

export const Product = mongoose.model("Product", ProductSchema);
