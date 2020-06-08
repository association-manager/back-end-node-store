export const typeDefs = gql`
    input CheckoutInput { products: [ProductInput!]! user: UserInput! address: AddressInput! totalVat: Float totalAmount: Float! }

    input UserInput { id: Int! first_name: String! last_name: String! mobile: Int! email: String! }

    input ProductInput { id: ID! name: String! quantity: Float! description: String url: String price:Float! vat:Float!
        associationId: Int! createdAt: String updatedAt: String }
    
    input AddressInput { id: Int addressLine1:String!, addressLine2:String!, postalCode: String!, city: String!, country: String!}

    type Query {
    product(id:ID!): Product
    products: [Product!]!
    invoices: [Invoice!]!
    }

    type Product {id: ID! name: String!, quantity: Float! description: String url: String price: Float! vat: Float! associationId: Int!
        createdAt: String updatedAt: String }

    type Invoice { id: ID! data: Checkout! created_at: String! amount: Float! vat: Float! }

    type User { id: Int! first_name: String! last_name: String! mobile: Int! email: String! created_at: String! }

    type Checkout { id: ID! products: [Product!]! user: User! }

    type Mutation {
        createProduct( name: String!, description: String!, url:String!, price:Float!, quantity:Float!, vat:Float!, associationId: Int! ): Product!
        register( first_name: String!, last_name: String!, roles: String! mobile: Int!, email: String!, password: String!, ): User!
        login(email: String!, password: String!): String!
        createSale(data: CheckoutInput! ): Invoice!
    }
`;

import {gql} from "apollo-server-express";
