import initDBenv from './init-db-env';
import initCodes from './init-codes';
import connectDatabase from './connect-db';
import initCollections from './init-collection';
import JWT from './init-jwt';

export default function(app: App) {
  const port = 4000;
  const dbEnv = initDBenv();
  app.context.db_env = dbEnv;
  app.context.$jwt = JWT;

  initCodes(app);

  return connectDatabase(app).then((mongoClient) => {
    initCollections(app, mongoClient);
    app.listen({ port });
    return port;
  });
}