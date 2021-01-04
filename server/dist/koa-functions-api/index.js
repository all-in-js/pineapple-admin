"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@iuv-tools/utils");
const injector_1 = require("@eryue/injector");
const defaultOptions = {
    path: '/api/functions',
    namespace: 'api',
    functions: []
};
/** types end */
const container = new injector_1.ContainerClass();
// TODO: combine functionPath
async function FunctionsApiResolver(cx) {
    let result = {
        code: 200,
        success: true,
        msg: 'success',
        data: []
    };
    const normallizedPath = cx.functionPath.replace(/^\/+/, '').replace(/\/+$/, '').split('/');
    console.log(normallizedPath, 3);
    const [namespace, ...functionPath] = normallizedPath;
    console.log(namespace, functionPath, 4);
    if (!functionPath.length) {
        result = {
            code: 400,
            success: false,
            msg: `the 'functionPath' is invalid. eg: 'namespace/method'`,
            data: []
        };
    }
    else {
        // resolve stored fns
        let [module] = container.resolve(namespace);
        if (!module) {
            result = {
                code: 500,
                success: false,
                msg: `functions is not exists.`,
                data: []
            };
            return result;
        }
        const fn = module[functionPath];
        if (utils_1.getArgType(fn).isFunction) {
            const data = await fn.call(cx, cx); // bind context
            result = {
                code: 200,
                success: true,
                msg: 'ok',
                data
            };
        }
        else {
            result = {
                code: 500,
                success: false,
                msg: `please check the function '${functionPath}'`,
                data: []
            };
        }
    }
    return result;
}
function functionsApiMiddleware(options) {
    if (!utils_1.getArgType(options).isObject)
        options = defaultOptions;
    options = Object.assign(defaultOptions, options);
    const { path: apiPath, namespace, functions } = options;
    // store fns as an object
    const fns = functions.reduce((curr, item) => {
        if (utils_1.getArgType(item).isFunction) {
            const { name } = item;
            if (!name) {
                utils_1.log.warn(`the function has no name, will be skiped:
          ${item.toString()}
        `);
            }
            else {
                curr[name] = item;
            }
        }
        return curr;
    }, {});
    // store fns
    container.add(namespace, fns);
    return async (cx, next) => {
        let functionsApiOptions = {
            functionPath: ''
        };
        // TODO: support others method
        if (cx.method.toLowerCase() === 'get') {
            const query = cx.query || {};
            functionsApiOptions = {
                ...functionsApiOptions,
                ...query
            };
        }
        if (cx.method.toLowerCase() === 'post') {
            const body = cx.request.body || {};
            functionsApiOptions = {
                ...functionsApiOptions,
                ...body
            };
        }
        const { variables, functionPath } = functionsApiOptions;
        if (!functionPath) {
            cx.status = 400;
            return cx.body = `the 'functionPath' expected to be send.`;
        }
        console.log(variables, functionPath, 1);
        // no matter GET or POST, get value from cx.variables
        cx.variables = variables;
        cx.var = variables; // alias
        cx.functionPath = functionPath;
        console.log(cx.path, apiPath, 2);
        if (cx.path === apiPath) {
            const { code, ...result } = await FunctionsApiResolver(cx);
            cx.status = code;
            cx.body = result;
        }
        else {
            // extra routes
            await next();
        }
    };
}
exports.functionsApiMiddleware = functionsApiMiddleware;
