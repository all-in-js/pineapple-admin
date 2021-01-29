"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const md5_1 = __importDefault(require("md5"));
const mongodb_1 = require("mongodb");
async function addUser(cx, vars) {
    const { username, password, role, using } = vars;
    if (!username || !password) {
        const { code, msg } = cx.codes.INVALID_REQUEST_PARAMS;
        return {
            code,
            msg: `${msg}: 'username' and 'password' expected.`,
            data: null
        };
    }
    const userInfo = await cx.$user.findOne({ username });
    if (userInfo) {
        const { code, msg } = cx.codes.RESOURCE_REPEAT;
        return {
            code,
            msg: `${msg}: 用户名重复`
        };
    }
    const pwdHash = md5_1.default(password);
    await cx.$user.insertOne({
        username,
        password: pwdHash,
        role,
        using,
        createTime: Date.now(),
        creator: ''
    });
    const { code } = cx.codes.SUCCESS;
    return {
        code,
        msg: '用户新建成功',
        data: null
    };
}
exports.addUser = addUser;
async function userList(cx, vars) {
    const { username, creator, using, role } = vars;
    const query = {};
    if (username) {
        query.username = username;
    }
    if (creator) {
        query.creator = creator;
    }
    if (using !== undefined) {
        query.using = using;
    }
    if (role !== undefined) {
        query.role = role;
    }
    const data = await cx.$user.find(query).sort({ createTime: -1 }).toArray();
    return {
        code: cx.codes.SUCCESS.code,
        data
    };
}
exports.userList = userList;
async function deleteUser(cx, vars) {
    if (!vars.id) {
        const { code, msg } = cx.codes.INVALID_REQUEST_PARAMS;
        return {
            code,
            msg: `${msg}: 'id' expected.`
        };
    }
    const _id = new mongodb_1.ObjectID(vars.id);
    await cx.$user.deleteOne({ _id });
    await cx.$project.deleteMany({ owner: _id });
    await cx.$svg.deleteMany({ owner: _id });
    return {
        code: cx.codes.SUCCESS.code,
        msg: '已删除该用户及其名下相关资源'
    };
}
exports.deleteUser = deleteUser;
async function toggleUserStatus(cx, vars) {
    if (!vars.id || vars.newStatus === undefined) {
        const { code, msg } = cx.codes.INVALID_REQUEST_PARAMS;
        return {
            code,
            msg: `${msg}: 'id' and 'newStatus' expected.`
        };
    }
    await cx.$user.updateOne({ _id: new mongodb_1.ObjectID(vars.id) }, { $set: { using: vars.newStatus } });
    return {
        code: cx.codes.SUCCESS.code,
        msg: '用户状态修改成功'
    };
}
exports.toggleUserStatus = toggleUserStatus;
async function upload(cx, vars) {
    const { alias, name } = vars;
    if (!alias || !name) {
        const { code, msg } = cx.codes.INVALID_REQUEST_PARAMS;
        return {
            code,
            msg: `${msg}: 'alias' and 'name' expected.`
        };
    }
    const file = cx.request.files.svg;
    if (!file) {
        const { code, msg } = cx.codes.NOT_FOUND;
        return {
            code,
            msg: `${msg}: 未接收到上传的文件'
    }
  }
  /**
   * 同一个项目下是否存在重复
   */
  const hasSvg = await SvgModel.findOne({ alias, name });
  if (hasSvg) {
    removeSync(file.path);
    return cx.body = {
      code: DATA_REPEAT,
      msg: '重复的图标'
    }
  }
  
  /**
   * 校验文件类型
   */
  const isSvg = file.type.startsWith('image/svg');
  if (!isSvg) {
    removeSync(file.path);
    return cx.body = {
      code: PARAM_INVALID,
      msg: '不支持的文件类型'
    }
  }
  const svgContent = readFileSync(file.path).toString();
  /**
   * svgo optimize
   */
  const svgInfo = await svgo.build(name, svgContent);
  /**
   * save
   */
  const timeStamp = Date.now();
  const { uid: userId, displayName: userName } = cx.userInfo || {};
  await new SvgModel({
    ...svgInfo,
    ...{
      alias,
      userId,
      userName,
      displayName: svgInfo.name,
      createTime: timeStamp,
      updateTime: timeStamp
    }}).save();
  /**
   * 删掉上传的文件
   */
  removeSync(file.path);
  cx.body = {
    code: SUCCESS,
    data: [],
    msg: '上传成功'
  }
}
        };
    }
}
exports.upload = upload;
