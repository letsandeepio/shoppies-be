const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
dotenv.config();

const Query = require('./resolvers/Query.js');
const Mutation = require('./resolvers/Mutation.js');

const prisma = new PrismaClient();

const resolvers = {
  Query,
  Mutation
};

const server = new GraphQLServer({
  typeDefs: './schema/schema.graphql',
  resolvers,
  context: (request) => {
    return {
      ...request,
      prisma
    };
  }
});

server.start(() => console.log(`Server  is running on http://localhost:4000`));
