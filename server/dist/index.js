"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const apollo_server_koa_1 = require("apollo-server-koa");
const typeDefs = apollo_server_koa_1.gql `
  type Task {
    name: String
    time: Int
  }
  type Query {
    hello: String
    hh: Int
    tasks(key: String): [Task]
  }
`;
const resolvers = {
    Query: {
        hello: () => `({
      name: '111'
    })`,
        hh: () => 1,
        tasks(a, o) {
            return [
                {
                    name: o.key,
                    time: 12345
                }
            ];
        }
    }
};
const server = new apollo_server_koa_1.ApolloServer({ typeDefs, resolvers,
    tracing: true });
const app = new koa_1.default();
const port = 4000;
server.applyMiddleware({ app });
app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
