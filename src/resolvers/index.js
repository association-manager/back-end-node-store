
import dotenv from 'dotenv';
import _query from './Query';
import _mutation from './Mutation';

dotenv.config();

export const resolvers = {
    Query: _query,
    Mutation: _mutation,
};
