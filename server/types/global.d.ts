import Koa from 'koa';
import MongoDB from 'mongodb';
import { ExtendContext } from '@all-in-js/koa-functions-api';
import { IcodesMap } from '../src/init/init-codes';
import { IJWT } from '../src/init/init-jwt';

/**
 * 扩展context
 */
declare global {
  
  interface IExtendContext {
    $collection: (col: string) => MongoDB.Collection;
    $project: MongoDB.Collection;
    $svg: MongoDB.Collection;
    $user: MongoDB.Collection;
    $jwt: IJWT;
    codes: IcodesMap;
  }
  type KoaContext = ExtendContext<IExtendContext>;
  type App = Koa<{}, KoaContext>;
}