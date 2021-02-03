import initDBenv from './init-db-env';
import initCodes from './init-codes';
import connectDatabase from './connect-db';
import initCollections from './init-collection';

export default function(app: App) {
  const dbEnv = initDBenv();
  app.context.db_env = dbEnv;

  initCodes(app);

  return connectDatabase(app).then((mongoClient) => {
    initCollections(app, mongoClient);
  });
}