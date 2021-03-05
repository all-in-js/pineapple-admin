import Koa from 'koa';
import cors from '@koa/cors';
import bodyparser from 'koa-bodyparser';
import uploadApi from '@all-in-js/koa-upload-api';
import { ObjectID } from 'mongodb';
import { functionsApiMiddleware } from '@all-in-js/koa-functions-api';
import init from './init';
import uploadApiService from './services/upload-svg';
import * as projectFunctions from './functions-api/projects';
import * as userFunctions from './functions-api/users';
import * as svgFunctions from './functions-api/svgs';

const app = new Koa<{}, KoaContext>();

app.use(async (cx, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
    const {
      code,
      msg
    } = cx.codes.INNER_ERROR;
    cx.body = {
      code,
      msg: `${msg}: ${e.message}`
    };
  }
});

app.use(cors());

app.use(bodyparser());

app.use(async (cx, next) => {
  const { path } = cx;
  if (path.startsWith('/api')) {
    const authToken = cx.headers.authorization || '';
    let authFailed = false;

    if (!authToken) {
      authFailed = true;
    } else {
      try {
        const payload: any = cx.$jwt.verify(authToken);
        if (payload && typeof payload === 'object') {
          const user = await cx.$user.findOne({_id: new ObjectID(payload._id)});
          if (user) {
            return await next();
          } else {
            authFailed = true;
          }
        } else {
          authFailed = true;
        }
      } catch (e) {
        authFailed = true;
      }
    }
    if (authFailed) {
      const {
        code,
        msg
      } = cx.codes.UNAUTHORIZED;
      cx.body = {
        code,
        msg: `${msg}: unauthorized.`
      }
    }
    // no payload error
  } else {
    await next();
  }
});

app.use(uploadApi<KoaContext>({
  uri: '/api/v1/upload',
  keepExtensions: true,
  ...uploadApiService
}));

app.use(functionsApiMiddleware<IExtendContext>({
  // path: '/api/functions',
  // namespace: 'api',
  functions: [
    ...Object.values(projectFunctions),
    ...Object.values(userFunctions),
    ...Object.values(svgFunctions)
  ],
  errorHandler(cx, err) {
    console.log(err);
    const {
      code,
      msg
    } = cx.codes.INNER_ERROR;
    cx.body = {
      code,
      msg: `${msg}: ${err.message}`
    };
  }
}));

/**
 * 初始化应用
 */
init(app).then(port => {
  console.log(`🚀 Server ready at http://localhost:${port}/api/functions`)
}).catch(e => {
  console.log(e);
  process.exit();
});

