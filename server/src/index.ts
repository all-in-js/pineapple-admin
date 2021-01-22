import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import cors from '@koa/cors';
import { functionsApiMiddleware } from 'koa-functions-api';
import connectDatabase from './utils/connect-db';
import * as projectFunctions from './functions-api/projects';
import * as userFunctions from './functions-api/users';

const app = new Koa<{}, KoaContext>();

connectDatabase(app);

app.use(cors());

app.use(bodyparser({
  formLimit: '100mb',
  jsonLimit: '100mb'
}));

app.use(functionsApiMiddleware<IExtendContext>({
  // path: '/api/functions',
  // namespace: 'api',
  functions: [
    ...Object.values(projectFunctions),
    ...Object.values(userFunctions)
  ]
}));

const port = 4000;
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}/api/functions`)
);