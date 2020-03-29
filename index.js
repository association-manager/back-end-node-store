const express = require('express'),
    {ApolloServer, gql } = require('apollo-server-express'),
    app = express(),
    port = 3300;

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.listen( port, () =>
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
);
