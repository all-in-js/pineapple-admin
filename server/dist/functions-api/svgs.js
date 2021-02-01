"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const svgo_1 = __importDefault(require("@open-fe/svg-icons/scripts/svgo"));
const services_1 = __importDefault(require("../services"));
const svgo = new svgo_1.default();
async function uploadSvg(cx, vars) {
    const { alias, name } = vars;
    if (!alias || !name) {
        const { code, msg } = cx.codes.INVALID_REQUEST_PARAMS;
        return {
            code,
            msg: `${msg}: 'alias' and 'name' expected.`
        };
    }
    const uploadService = new services_1.default({
        keepExtensions: true,
        key: 'svg'
    });
    const { err, file } = await uploadService.transform(cx.req);
    if (err) {
        const { code, msg } = cx.codes.INNER_ERROR;
        return {
            code,
            msg: `${msg}: ${err.message}`
        };
    }
    if (!file) {
        const { code, msg } = cx.codes.NOT_FOUND;
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
        fs_extra_1.default.removeSync(file.path);
        const { code, msg } = cx.codes.INVALID_REQUEST_PARAMS;
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
        fs_extra_1.default.removeSync(file.path);
        const { code, msg } = cx.codes.RESOURCE_REPEAT;
        return {
            code,
            msg: `${msg}: 重复的图标`
        };
    }
    const svgContent = fs_extra_1.default.readFileSync(file.path).toString();
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
        }
    });
    /**
     * 删掉上传的文件
     */
    fs_extra_1.default.removeSync(file.path);
    cx.body = {
        code: cx.codes.SUCCESS.code,
        data: [],
        msg: '上传成功'
    };
}
exports.uploadSvg = uploadSvg;
