import MongoDB from 'mongodb';
import { ExtendContext } from 'koa-functions-api';

/**
 * 扩展context
 */
declare global {
  interface IcodeItem {
    code: number;
    msg: string;
  }
  interface IcodesMap {
    [key: string]: IcodeItem;
  }
  interface IExtendContext {
    $collection: (col: string) => MongoDB.Collection;
    $project: MongoDB.Collection;
    $svg: MongoDB.Collection;
    $user: MongoDB.Collection;
    codes: IcodesMap;
  }
  type KoaContext = ExtendContext<IExtendContext>;
}
