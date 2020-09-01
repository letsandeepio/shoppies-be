const { GraphQLServer } = require('graphql-yoga');

const Query = require('./resolvers/Query.js');
const Mutation = require('./resolvers/Mutation.js');

const resolvers = {
  Query
};

const server = new GraphQLServer({
  typeDefs: './schema/schema.graphql',
  resolvers
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
