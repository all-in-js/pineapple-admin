import Koa from 'koa';
import MongoDB from 'mongodb';
import Dotenv from 'dotenv';
import path from 'path';

interface IcodeItem {
  code: number;
  msg: string;
}
enum CodesKey {
  UNKNOW = 'UNKNOW',
  SUCCESS = 'SUCCESS',
  INNER_ERROR = 'INNER_ERROR',
  INVALID_PARAMS_TYPE = 'INVALID_PARAMS_TYPE',
  INNERT_ERROR = 'INNERT_ERROR',
  DELETE_ERROR = 'DELETE_ERROR',
  UPDATE_ERROR = 'UPDATE_ERROR',
  QUERY_ERROR = 'QUERY_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_REPEAT = 'RESOURCE_REPEAT',
  INVALID_REQUEST_PARAMS = 'INVALID_REQUEST_PARAMS'
}

export type IcodesMap = {
  [key in CodesKey]: IcodeItem;
}

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
      /**
       * user model
       */
      app.context.$user = $collection('users');
      /**
       * init codes
       * 系统级：10--
       * 数据级: 20--
       * 业务级：30--
       */
      app.context.codes = {
        [CodesKey.SUCCESS]: {
          code: 1000,
          msg: CodesKey.SUCCESS
        },
        [CodesKey.UNKNOW]: {
          code: 1001,
          msg: CodesKey.UNKNOW
        },
        [CodesKey.INNER_ERROR]: {
          code: 1002,
          msg: CodesKey.INNER_ERROR
        },
        [CodesKey.INVALID_PARAMS_TYPE]: {
          code: 2001,
          msg: CodesKey.INVALID_PARAMS_TYPE
        },
        [CodesKey.INNERT_ERROR]: {
          code: 2002,
          msg: CodesKey.INNERT_ERROR
        },
        [CodesKey.DELETE_ERROR]: {
          code: 2003,
          msg: CodesKey.DELETE_ERROR
        },
        [CodesKey.UPDATE_ERROR]: {
          code: 2004,
          msg: CodesKey.UPDATE_ERROR
        },
        [CodesKey.QUERY_ERROR]: {
          code: 2005,
          msg: CodesKey.QUERY_ERROR
        },
        [CodesKey.NOT_FOUND]: {
          code: 2006,
          msg: CodesKey.NOT_FOUND
        },
        [CodesKey.RESOURCE_REPEAT]: {
          code: 2007,
          msg: CodesKey.RESOURCE_REPEAT
        },
        [CodesKey.INVALID_REQUEST_PARAMS]: {
          code: 3001,
          msg: CodesKey.INVALID_REQUEST_PARAMS
        }
      };

    })();
  } catch (e) {
    throw e;
  }
}