import MongoDB from 'mongodb';

export default async function connectDatabase(app: App): Promise<MongoDB.MongoClient> {
  return new Promise((rs, rj) => {
    try {
      const {
        DB_HOST,
        DB_PORT,
        DB_DATABASE
      } = app.context.db_env;
      const dbURI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
      MongoDB.MongoClient.connect(dbURI, {
        useUnifiedTopology: true
      }, (err, mongoClient) => {
        if (err) {
          rj(err);
        } else {
          rs(mongoClient);
        }
      });
    } catch (e) {
      console.log('err timeout-----------------', e);
      throw e;
    }
  });
}

