import SvgOptimize from '@open-fe/svg-icons/scripts/svgo';
import { readFileSync } from 'fs-extra';
import { UploadedResult } from 'koa-upload-api';

const svgo = new SvgOptimize();

interface UploadApiService {
  validator: (cx: KoaContext) => Promise<boolean>;
  response: (cx: KoaContext, result: any) => any;
}
const uploadApiService: UploadApiService = {
  async validator(cx: KoaContext): Promise<boolean> {
    const {
      alias
    } = cx.request.body;
    
    if (!alias) {
      const {
        code,
        msg
      } = cx.codes.INVALID_REQUEST_PARAMS;
      cx.body = {
        code,
        msg: `${msg}: 'alias' expected.`
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
    return true;
  },
  async response(cx: KoaContext, result: UploadedResult) {
    const {
      error,
      files
    } = result;
    if (error) {
      console.log(error);
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
        alias
      } = cx.request.body;
      const file: {[key: string]: any} = files.svg;
      if (file) {
        const {
          name,
          path: filepath
        } = file;
        const filename = name.replace(/\.\w+$/, '');
        const svgContent = readFileSync(filepath).toString();
        const svgInfo = await svgo.build(filename, svgContent);

        const svgData = {
          ...svgInfo,
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