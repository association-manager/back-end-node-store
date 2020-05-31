import {gql} from "apollo-server-express";

export const typeDefs = gql`
    type Query {
        product(id:ID!): Product
        products: [Product!]!
        invoices: [Invoice!]!
    }
    type Product {
        id: ID!
        name: String!
        description: String
        url: String
        price:Float!
        vat:Float!
        associationId: Int!
        createdAt: String
        updatedAt: String
    }
    type Invoice {
        id: ID!
        created_at: String!
        amount: Float!
        vat: Float!
    }
    type Mutation {
        createProduct(
            name: String!,
            description: String!,
            url:String!,
            price:Float!,
            vat:Float!,
            associationId: Int!
        ): Product!
    }
`;
