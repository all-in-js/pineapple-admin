import MongoDB from 'mongodb';
import { ExtendContext } from 'koa-functions-api';

/**
 * 扩展context
 */
declare global {
  interface IExtendContext {
    $collection: (col: string) => MongoDB.Collection;
    $project: MongoDB.Collection;
    $svg: MongoDB.Collection;
  }
  type KoaContext = ExtendContext<IExtendContext>;
}
