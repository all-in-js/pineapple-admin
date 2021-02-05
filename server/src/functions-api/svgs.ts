
/**
 * 项目图标列表
 * 1. 检索条件
 * {
 *   name: 图标名称
 * }
 */
interface SvgListParams {
  name?: string;
  pageSize?: number;
  pageNo?: number;
}
export async function svgList(cx: KoaContext, vars: SvgListParams) {
  const {
    name,
    pageSize = 50,
    pageNo = 1
  } = vars;
  const query: any = {};

  if (name) {
    query.name = {
      $regex: new RegExp(name, 'ig')
    }
  }
  const svgs = await cx.$svg.find(query).limit(pageSize).skip((pageNo - 1) * pageSize).toArray();
  return {
    code: cx.codes.SUCCESS.code,
    msg: '',
    data: svgs
  };
}
