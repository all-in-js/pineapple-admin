import Koa from 'koa';
import { getArgType } from '@iuv-tools/utils';
import { ContainerClass } from '@eryue/injector';

/**
 * types start */
interface IRestfulProxyOptions {
  variables?: { [key: string]: any };
  restfulPath: string;
}

interface IOptions {
  path: '/api/restful-proxy'
}

interface IResult {
  code: number;
  success: boolean;
  msg: string;
  data: any;
}
/** types end */

const container = new ContainerClass();

export function RestfulProxyControler(moduleAlias: string, options: any) {
  return function(targetClass: FunctionConstructor) {
    container.add(moduleAlias, new targetClass(options));
  }
}

// TODO: combine restfulPath
async function RestfulProxyResolver(cx: Koa.ParameterizedContext) {
  let result: IResult = {
    code: 200,
    success: true,
    msg: 'success',
    data: []
  };
  const normallizedPath = cx.restfulPath.replace(/^\/+/, '').replace(/\/+$/, '').split('/');
  const [moduleAlias, ...methodPath] = normallizedPath;
  if (!methodPath.length) {
    result = {
      code: 400,
      success: false,
      msg: `the 'restfulPath' is invalid. eg: 'module/method'`,
      data: []
    };
  } else {
    let [module] = container.resolve('moduleAlias');
    let count = 0;
    while(count <= methodPath.length - 1) {
      module = module[methodPath[count]];
      if (!module) {
        break;
      }
      count ++;
    }
    if (getArgType(module).isFunction) {
      const data = await module(cx);
      result = {
        code: 200,
        success: true,
        msg: 'ok',
        data
      };
    } else {
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

export async function RestfulProxyMiddleware(options: IOptions) {
  const { path: apiPath } = options;
  return async (cx: Koa.ParameterizedContext, next: Koa.Next) => {
    let restfulProxyOptions: IRestfulProxyOptions = {
      restfulPath: ''
    };
    if (cx.method.toLowerCase() === 'get') {
      restfulProxyOptions = cx.query || {};
    }
    if (cx.method.toLowerCase() === 'post') {
      restfulProxyOptions = cx.request.body || {};
    }
  
    const {
      variables,
      restfulPath
    } = restfulProxyOptions;

    if (!restfulPath) {
      cx.status = 400;
      return cx.body = `the 'restfulPath' expected to be send.`;
    }

    cx.variables = variables;
    cx.restfulPath = restfulPath;

    if (cx.path === apiPath) {
      const { code, ...result } = await RestfulProxyResolver(cx);
      cx.status = code;
      cx.body = result;
    } else {
      await next();
    }
  }
}