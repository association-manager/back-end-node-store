import { ApolloServer } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDefs";
import session from 'express-session';
import cors from 'cors';
import dotenv  from 'dotenv';
dotenv.config();

import isAuth from './middleware/isAuth'

const startServer = async () => {
    const app = express();
    app.disable('x-powered-by');
    const SECRET = 'alihasanaSecret';
    app.use(cors('*'));
    app.use(session({
        name: 'sessionName',
        secret: 'secretKey',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000,
            sameSite: true,
            secure: 'development'
        }
    }));
    app.use(isAuth);

    const server = new ApolloServer({
        playground: true,
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({ req, res }),
        formatError: (err) => {
            // Don't give the specific errors to the client.
            if (err.message.startsWith("Database Error: ")) {
                return new Error('Internal server error');
            }
            // Otherwise return the original error.  The error can also
            // be manipulated in other ways, so long as it's returned.
            return err.message;
        },
    });


    server.applyMiddleware({ app });

    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    app.listen({ port: process.env.PORT }, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
};

startServer();
