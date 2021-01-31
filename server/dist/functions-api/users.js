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
