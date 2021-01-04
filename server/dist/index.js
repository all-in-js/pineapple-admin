"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_functions_api_1 = require("koa-functions-api");
const app = new koa_1.default();
app.use(koa_functions_api_1.functionsApiMiddleware({
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
app.use((cx, next) => {
    cx.body = '1';
});
const port = 4000;
app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:${port}/api/functions`));
