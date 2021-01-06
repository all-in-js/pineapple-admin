import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import { functionsApiMiddleware } from 'koa-functions-api';
import connectDatabase from './utils/connect-db';
import * as projectFunctions from './functions-api/projects';

const app = new Koa<{}, KoaContext>();

connectDatabase(app);

app.use(bodyparser({
  formLimit: '100mb',
  jsonLimit: '100mb'
}));

app.use(functionsApiMiddleware<IExtendContext>({
  // path: '/api/functions',
  // namespace: 'api',
  functions: [
    ...Object.values(projectFunctions)
  ]
}));

const port = 4000;
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}/api/functions`)
);