import MongoDB from 'mongodb';
import Koa from 'koa';

/**
 * 扩展context
 */
declare global {
  interface IExtendContext {
    $collection: (col: string) => MongoDB.Collection;
    $project: MongoDB.Collection;
    $svg: MongoDB.Collection;
  }
  type KoaContext = Koa.ParameterizedContext<{}, IExtendContext>;
}
