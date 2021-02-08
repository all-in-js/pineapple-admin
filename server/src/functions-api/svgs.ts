
/**
 * 项目图标列表
 * 1. 检索条件
 * {
 *   name: 图标名称
 * }
 */
interface SvgListParams {
  name?: string;
  alias?: string;
  pageSize?: number;
  pageNo?: number;
}
export async function svgList(cx: KoaContext, vars: SvgListParams) {
  const {
    name,
    alias,
    pageSize = 50,
    pageNo = 1
  } = vars;
  const query: any = {};

  if (name) {
    query.name = {
      $regex: new RegExp(name, 'ig')
    }
  }
  if (alias) {
    query.alias = alias;
  }
  const svgs = await cx.$svg.find(query).sort({createTime: -1}).limit(pageSize).skip((pageNo - 1) * pageSize).toArray();
  return {
    code: cx.codes.SUCCESS.code,
    msg: '',
    data: svgs
  };
}
