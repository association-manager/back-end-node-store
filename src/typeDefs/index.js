export const typeDefs = gql`
    input CheckoutInput { products: [ProductInput!]! User: UserInput! }

    input UserInput { id: Int! first_name: String! last_name: String! mobile: Int! email: String! created_at: String! }

    input ProductInput { id: ID! name: String! description: String url: String price:Float! vat:Float!
        associationId: Int! createdAt: String updatedAt: String }

    type Query {
    product(id:ID!): Product
    products: [Product!]!
    invoices: [Invoice!]!
    }

    type Product {id: ID! name: String! description: String url: String price: Float! vat: Float! associationId: Int!
        createdAt: String updatedAt: String }

    type Invoice { id: ID! invoiceNumber: String! data: Checkout! created_at: String! amount: Float! vat: Float! }

    type User { id: Int! first_name: String! last_name: String! mobile: Int! email: String! created_at: String! }

    type Checkout { id: ID! products: [Product!]! User: User! }

    type Mutation {
        createProduct( name: String!, description: String!, url:String!, price:Float!, vat:Float!, associationId: Int! ): Product!
        register( first_name: String!, last_name: String!, roles: String! mobile: Int!, email: String!, password: String!, ): User!
        login(email: String!, password: String!): String!
        createSale(data: CheckoutInput! ): Invoice!
    }
`;

import {gql} from "apollo-server-express";
