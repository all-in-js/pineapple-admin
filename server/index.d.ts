import MongoDB from 'mongodb';
import { ExtendContext } from 'koa-functions-api';
import { IcodesMap } from './src/utils/connect-db';

/**
 * 扩展context
 */
declare global {
  
  interface IExtendContext {
    $collection: (col: string) => MongoDB.Collection;
    $project: MongoDB.Collection;
    $svg: MongoDB.Collection;
    $user: MongoDB.Collection;
    codes: IcodesMap;
  }
  type KoaContext = ExtendContext<IExtendContext>;
}