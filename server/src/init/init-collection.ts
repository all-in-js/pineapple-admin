import { MongoClient } from 'mongodb';

export default function initCollections(app: App, mongoClient: MongoClient) {
  /**
   * 初始化collection
   */
  const $collection = (col: string) => {
    return mongoClient.db(app.context.db_env.DB_DATABASE).collection(col);
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
  /**
   * user model
   */
  app.context.$user = $collection('users');
}
