import Koa from 'koa';
import { ApolloServer, gql } from 'apollo-server-koa';

const typeDefs = gql`
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
    tasks(a: any, o: any) {
      return [
        {
          name: o.key,
          time: 12345
        }
      ];
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = new Koa();
const port = 4000;
server.applyMiddleware({ app });

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
);