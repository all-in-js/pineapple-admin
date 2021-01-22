import Koa from 'koa';
import MongoDB from 'mongodb';
import Dotenv from 'dotenv';
import path from 'path';

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
      const UNKNOW = 'UNKNOW';
      const SUCCESS = 'SUCCESS';
      const INNER_ERROR = 'INNER_ERROR';
      const INVALID_PARAMS_TYPE = 'INVALID_PARAMS_TYPE';
      const INNERT_ERROR = 'INNERT_ERROR';
      const DELETE_ERROR = 'DELETE_ERROR';
      const UPDATE_ERROR = 'UPDATE_ERROR';
      const QUERY_ERROR = 'QUERY_ERROR';
      const NOT_FOUND = 'NOT_FOUND';
      const RESOURCE_REPEAT = 'RESOURCE_REPEAT';
      const INVALID_REQUEST_PARAMS = 'INVALID_REQUEST_PARAMS';
      
      app.context.codes = {
        [SUCCESS]: {
          code: 1000,
          msg: SUCCESS
        },
        [UNKNOW]: {
          code: 1001,
          msg: UNKNOW
        },
        [INNER_ERROR]: {
          code: 1002,
          msg: INNER_ERROR
        },
        [INVALID_PARAMS_TYPE]: {
          code: 2001,
          msg: INVALID_PARAMS_TYPE
        },
        [INNERT_ERROR]: {
          code: 2002,
          msg: INNERT_ERROR
        },
        [DELETE_ERROR]: {
          code: 2003,
          msg: DELETE_ERROR
        },
        [UPDATE_ERROR]: {
          code: 2004,
          msg: UPDATE_ERROR
        },
        [QUERY_ERROR]: {
          code: 2005,
          msg: QUERY_ERROR
        },
        [NOT_FOUND]: {
          code: 2006,
          msg: NOT_FOUND
        },
        [RESOURCE_REPEAT]: {
          code: 2007,
          msg: RESOURCE_REPEAT
        },
        [INVALID_REQUEST_PARAMS]: {
          code: 3001,
          msg: INVALID_REQUEST_PARAMS
        }
      };

    })();
  } catch (e) {
    throw e;
  }
}