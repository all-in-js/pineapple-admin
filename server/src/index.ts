import Koa from 'koa';
import { functionsApiMiddleware } from 'koa-functions-api';

const app = new Koa();

app.use(functionsApiMiddleware({
  // path: '/api/functions',
  // namespace: 'api',
  functions: [
    function userList(cx) {
      return 'okkkk';
    },
    function userInfo() {
      return [12345];
    }
  ]
}));

const port = 4000;
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}/api/functions`)
);