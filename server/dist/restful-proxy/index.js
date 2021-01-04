"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@iuv-tools/utils");
const injector_1 = require("@eryue/injector");
const defaultApipath = '/api/restful-proxy';
/** types end */
const container = new injector_1.ContainerClass();
function RestfulProxyControler(moduleAlias, options) {
    return function (targetClass) {
        container.add(moduleAlias, new targetClass(options));
    };
}
exports.RestfulProxyControler = RestfulProxyControler;
// TODO: combine restfulPath
async function RestfulProxyResolver(cx) {
    let result = {
        code: 200,
        success: true,
        msg: 'success',
        data: []
    };
    const normallizedPath = cx.restfulPath.replace(/^\/+/, '').replace(/\/+$/, '').split('/');
    console.log(normallizedPath, 3);
    const [moduleAlias, ...methodPath] = normallizedPath;
    console.log(moduleAlias, methodPath, 4);
    if (!methodPath.length) {
        result = {
            code: 400,
            success: false,
            msg: `the 'restfulPath' is invalid. eg: 'module/method'`,
            data: []
        };
    }
    else {
        let [module] = container.resolve(moduleAlias);
        if (!module) {
            result = {
                code: 500,
                success: false,
                msg: `the controler '${moduleAlias}' is not exists.`,
                data: []
            };
            return result;
        }
        let count = 0;
        while (count <= methodPath.length - 1) {
            module = module[methodPath[count]];
            if (!module) {
                break;
            }
            count++;
        }
        if (utils_1.getArgType(module).isFunction) {
            const data = await module(cx);
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
                msg: `please check the controler '${moduleAlias}'`,
                data: []
            };
        }
    }
    return result;
}
function restfulProxyMiddleware(options) {
    if (!options)
        options = {
            path: defaultApipath
        };
    const { path: apiPath } = options;
    return async (cx, next) => {
        let restfulProxyOptions = {
            restfulPath: ''
        };
        if (cx.method.toLowerCase() === 'get') {
            restfulProxyOptions = cx.query || {};
        }
        if (cx.method.toLowerCase() === 'post') {
            restfulProxyOptions = cx.request.body || {};
        }
        const { variables, restfulPath } = restfulProxyOptions;
        if (!restfulPath) {
            cx.status = 400;
            return cx.body = `the 'restfulPath' expected to be send.`;
        }
        console.log(variables, restfulPath, 1);
        cx.variables = variables;
        cx.restfulPath = restfulPath;
        console.log(cx.path, apiPath, 2);
        if (cx.path === apiPath) {
            const { code, ...result } = await RestfulProxyResolver(cx);
            cx.status = code;
            cx.body = result;
        }
        else {
            await next();
        }
    };
}
exports.restfulProxyMiddleware = restfulProxyMiddleware;
