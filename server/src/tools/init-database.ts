import Koa from 'koa';
import MongoDB from 'mongodb';
import Dotenv from 'dotenv';
import path from 'path';

export const initDatabase = (app: Koa<{}, IExtendContext>) => {
  try {
    const { NODE_ENV } = process.env;
    const dbConfigPath = path.resolve(process.cwd(), `.${NODE_ENV}.env`);
    const env = Dotenv.config({ path: dbConfigPath }).parsed || {};
    (async () => {
      const mongoClient = await MongoDB.MongoClient.connect(`mongodb://${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}`);
      const $collection = (col: string) => {
        return mongoClient.db(env.DB_DATABASE).collection(col);
      }
      const projectModel = $collection('project');
      app.context.$collection = $collection;
      /**
       * 项目model
       */
      app.context.$project = projectModel;
      /**
       * svg model
       */
      app.context.$svg = $collection('svg');

      /**
       * 创建默认的通用图标集
       */
      await createCommonProject(projectModel);
    })();
  } catch (e) {
    throw e;
  }
}

async function createCommonProject($project: MongoDB.Collection) {
  const alias = 'common';
  const hasCommon = await $project.findOne({alias});
  if (!hasCommon) {
    const timeStamp = Date.now();
    await $project.insertOne({
      alias,
      name: '通用图标集',
      mark: '系统默认的通用图标集',
      createTime: timeStamp,
      updateTime: timeStamp
    });
    console.log(`[${new Date().toLocaleString()}] 已创建通用图标集 $project -> common`);
  }
}