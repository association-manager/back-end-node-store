import { gql } from "apollo-server-express";

export const typeDefs = gql`
    type Query {
        products: [Product!]!
    }
    type Product {
        id: ID!
        name: String!
    }
    type Mutation {
        createProduct(name: String!): Product!
    }
`;
