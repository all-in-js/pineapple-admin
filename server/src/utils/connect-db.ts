import Koa from 'koa';
import MongoDB from 'mongodb';
import Dotenv from 'dotenv';
import path from 'path';
import { ExtendContext } from 'koa-functions-api';

export default function connectDatabase(app: Koa<{}, KoaContext>) {
  try {
    const { NODE_ENV } = process.env;
    const dbConfigPath = path.resolve(process.cwd(), `.${NODE_ENV}.env`);
    const env = Dotenv.config({ path: dbConfigPath }).parsed || {};
    (async () => {
      const mongoClient = await MongoDB.MongoClient.connect(`mongodb://${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}`);
      const $collection = (col: string) => {
        return mongoClient.db(env.DB_DATABASE).collection(col);
      }
      const projectModel = $collection('projects');
      app.context.$collection = $collection;
      /**
       * 项目model
       */
      app.context.$project = projectModel;
      /**
       * svg model
       */
      app.context.$svg = $collection('svgs');

    })();
  } catch (e) {
    throw e;
  }
}