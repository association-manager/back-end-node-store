import { ApolloServer } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDefs";
import session from 'express-session';
import cors from 'cors';
import dotenv  from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

const startServer = async () => {
    const app = express();
    app.disable('x-powered-by');
    const SECRET = 'alihasanaSecret'
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

    const server = new ApolloServer({
        playground: true,
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({ req, res }),
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
