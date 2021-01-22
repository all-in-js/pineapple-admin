"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const md5_1 = __importDefault(require("md5"));
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
        return cx.body = {
            code,
            msg: `${msg}: 用户名重复`
        };
    }
    const pwdHash = md5_1.default(password);
    await cx.$user.insertOne({
        username,
        password: pwdHash,
        role,
        using
    });
    const { code } = cx.codes.SUCCESS;
    return {
        code,
        msg: '用户新建成功',
        data: null
    };
}
exports.addUser = addUser;
async function userList(cx) {
    const data = await cx.$user.find({}).toArray();
    return {
        code: cx.codes.SUCCESS.code,
        data
    };
}
exports.userList = userList;
