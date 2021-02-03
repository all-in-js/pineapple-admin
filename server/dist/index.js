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
const cors_1 = __importDefault(require("@koa/cors"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const node_upload_api_1 = __importDefault(require("node-upload-api"));
const koa_functions_api_1 = require("koa-functions-api");
const init_1 = __importDefault(require("./init"));
const projectFunctions = __importStar(require("./functions-api/projects"));
const userFunctions = __importStar(require("./functions-api/users"));
const svgFunctions = __importStar(require("./functions-api/svgs"));
const app = new koa_1.default();
app.use(cors_1.default());
app.use(koa_bodyparser_1.default());
app.use(node_upload_api_1.default({
    uri: '/v1/upload',
    keepExtensions: true,
    response(cx, result) {
        cx.body = result;
    }
}));
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
/**
 * 初始化应用
 */
init_1.default(app).then(() => {
    app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:${port}/api/functions`));
}).catch(e => {
    console.log(e);
    process.exit();
});
