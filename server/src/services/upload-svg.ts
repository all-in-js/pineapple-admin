import SvgOptimize from '@all-in-js/svg-icons/scripts/svgo';
import { readFileSync } from 'fs-extra';
import { UploadedResult } from '@all-in-js/koa-upload-api';

const svgo = new SvgOptimize();

interface UploadApiService {
  validator: (cx: KoaContext) => Promise<boolean>;
  response: (cx: KoaContext, result: any) => any;
}
const uploadApiService: UploadApiService = {
  async validator(cx: KoaContext): Promise<boolean> {
    const {
      alias,
      name
    } = cx.request.body;
    if (!alias || !name || alias === 'undefined' || name === 'undefined') {
      const {
        code,
        msg
      } = cx.codes.INVALID_REQUEST_PARAMS;
      cx.body = {
        code,
        msg: `${msg}: 'alias' and 'name' expected.`
      };
      return false;
    }

    const proj = await cx.$project.findOne({ alias });
    if (!proj) {
      const {
        code,
        msg
      } = cx.codes.NOT_FOUND;
      cx.body = {
        code,
        msg: `${msg}: 项目不存在`
      };
      return false;
    }

    const svg = await cx.$svg.findOne({
      alias,
      name
    });
    if (svg) {
      const {
        code,
        msg
      } = cx.codes.RESOURCE_REPEAT;
      cx.body = {
        code,
        msg: `${msg}: '${name}'名称重复`
      };
      return false;
    }
    return true;
  },
  async response(cx: KoaContext, result: UploadedResult) {
    const {
      error,
      files
    } = result;
    if (error) {
      const {
        code,
        msg
      } = cx.codes.INNER_ERROR;
      cx.body = {
        code,
        msg: `${msg}: ${error.message}`
      }
    } else {
      const {
        alias,
        name
      } = cx.request.body;
      const file: {[key: string]: any} = files.svg;
      if (file) {
        const {
          path: filepath
        } = file;
        const svgContent = readFileSync(filepath).toString();
        const svgInfo = await svgo.build(name, svgContent);

        const svgData = {
          ...svgInfo,
          name,
          alias,
          createTime: Date.now(),
          userId: '',
          userName: ''
        };
        await cx.$svg.insertOne(svgData);
        cx.body = {
          code: cx.codes.SUCCESS.code,
          msg: '',
          data: svgData
        };
      }
    }
  }
};
export default uploadApiService;