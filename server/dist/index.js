"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_functions_api_1 = require("koa-functions-api");
const connect_db_1 = __importDefault(require("./utils/connect-db"));
const projectFunctions = __importStar(require("./functions-api/projects"));
const userFunctions = __importStar(require("./functions-api/users"));
const svgFunctions = __importStar(require("./functions-api/svgs"));
const app = new koa_1.default();
connect_db_1.default(app);
app.use(cors_1.default());
app.use(koa_body_1.default());
app.use(koa_functions_api_1.functionsApiMiddleware({
    // path: '/api/functions',
    // namespace: 'api',
    functions: [
        ...Object.values(projectFunctions),
        ...Object.values(userFunctions),
        ...Object.values(svgFunctions)
    ],
    errorHandler(cx, err) {
        console.log(err);
        const { code, msg } = cx.codes.INNER_ERROR;
        cx.body = {
            code,
            msg: `${msg}: ${err.message}`
        };
    }
}));
const port = 4000;
app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:${port}/api/functions`));
