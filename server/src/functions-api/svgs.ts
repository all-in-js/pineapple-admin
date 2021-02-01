import fs from 'fs-extra';
import SvgOptimize from '@open-fe/svg-icons/scripts/svgo';
import UploadService from '../services';

const svgo = new SvgOptimize();

/**
 * 上传图标
 * {
 *  alias: 所属项目的简称
 *  name: 图标名称
 * }
 */
interface UploadParams {
  alias?: string;
  name?: string;
}
export async function uploadSvg(cx: KoaContext, vars: UploadParams) {
  const { alias, name } = vars;
  if (!alias || !name) {
    const {
      code,
      msg
    } = cx.codes.INVALID_REQUEST_PARAMS;
    return {
      code,
      msg: `${msg}: 'alias' and 'name' expected.`
    }
  }

  const uploadService = new UploadService({
    keepExtensions: true,
    key: 'svg'
  });
  const {
    err,
    file
  } = await uploadService.transform(cx.req);
  if (err) {
    const {
      code,
      msg
    } = cx.codes.INNER_ERROR;
    return {
      code,
      msg: `${msg}: ${err.message}`
    };
  }
  if (!file) {
    const {
      code,
      msg
    } = cx.codes.NOT_FOUND
    return {
      code,
      msg: `${msg}: 未接收到文件`
    };
  }

  /**
   * 校验文件类型
   */
  const isSvg = file.type.startsWith('image/svg');
  if (!isSvg) {
    fs.removeSync(file.path);
    const {
      code,
      msg
    } = cx.codes.INVALID_REQUEST_PARAMS;
    return {
      code,
      msg: `${msg}: 不支持的文件类型`
    };
  }
  /**
   * 同一个项目下是否存在重复
   */
  const hasSvg = await cx.$svg.findOne({ alias, name });
  if (hasSvg) {
    fs.removeSync(file.path);
    const {
      code,
      msg
    } = cx.codes.RESOURCE_REPEAT;
    return {
      code,
      msg: `${msg}: 重复的图标`
    };
  }
  
  const svgContent = fs.readFileSync(file.path).toString();
  /**
   * svgo optimize
   */
  // TODO: import svgo
  const svgInfo = await svgo.build(name, svgContent);
  /**
   * save
   */
  const timeStamp = Date.now();
  const { uid: userId, displayName: userName } = cx.userInfo || {};
  await cx.$svg.insertOne({
    ...svgInfo,
    ...{
      alias,
      userId,
      userName,
      displayName: svgInfo.name,
      createTime: timeStamp
    }});
  /**
   * 删掉上传的文件
   */
  fs.removeSync(file.path);
  cx.body = {
    code: cx.codes.SUCCESS.code,
    data: [],
    msg: '上传成功'
  }
}