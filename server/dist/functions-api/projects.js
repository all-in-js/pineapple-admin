"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
async function projects(cx, vars) {
    const { name, alias, creator, using } = vars;
    const query = {};
    if (name) {
        query.name = {
            $regex: new RegExp(name, 'ig')
        };
    }
    if (alias) {
        query.alias = {
            $regex: new RegExp(alias, 'ig')
        };
    }
    if (creator) {
        query.creator = {
            $regex: new RegExp(creator, 'ig')
        };
    }
    if (using !== undefined) {
        query.using = using;
    }
    const projects = await cx.$project.find(query).sort({ createTime: -1 }).toArray();
    return {
        code: cx.codes.SUCCESS.code,
        data: projects,
        msg: ''
    };
}
exports.projects = projects;
async function project(cx, vars) {
    const { id } = vars;
    if (!id) {
        cx.status = 400;
        return {
            success: false,
            msg: `'id' expected.`
        };
    }
    const project = await cx.$project.findOne({ _id: new mongodb_1.ObjectID(id) });
    return project;
}
exports.project = project;
async function addProject(cx, vars) {
    const { name, alias, mark, using } = vars;
    if (!name || !alias) {
        const { code, msg } = cx.codes.INVALID_REQUEST_PARAMS;
        return {
            code,
            msg: `${msg}: 'name' and 'alias' expected.`
        };
    }
    const project = await cx.$project.findOne({ alias });
    if (project) {
        const { code, msg } = cx.codes.RESOURCE_REPEAT;
        return {
            code,
            msg: `${msg}: 项目alias重复`
        };
    }
    await cx.$project.insertOne({
        name,
        alias,
        mark,
        using,
        totalIcons: 0,
        totalMembers: [],
        createTime: Date.now(),
        creator: ''
    });
    return {
        code: cx.codes.SUCCESS.code,
        msg: '项目新建成功',
        data: []
    };
}
exports.addProject = addProject;
async function deleteProject(cx, vars) {
    const { alias } = vars;
    if (!alias) {
        const { code, msg } = cx.codes.INVALID_REQUEST_PARAMS;
        return {
            code,
            msg: `${msg}: 'alias' expected.`
        };
    }
    await cx.$project.deleteOne({ alias });
    await cx.$svg.deleteMany({ alias });
    return {
        code: cx.codes.SUCCESS.code,
        msg: '已成功删除项目及相关联的图标'
    };
}
exports.deleteProject = deleteProject;
async function toggleProjectStatus(cx, vars) {
    const { id, newStatus } = vars;
    if (!id || newStatus === undefined) {
        const { code, msg } = cx.codes.INVALID_REQUEST_PARAMS;
        return {
            code,
            msg: `${msg}: 'id' and 'newStatus' expected.`
        };
    }
    await cx.$project.updateOne({ _id: new mongodb_1.ObjectID(id) }, { $set: { using: newStatus } });
    return {
        code: cx.codes.SUCCESS.code,
        msg: '项目状态更新成功',
        data: []
    };
}
exports.toggleProjectStatus = toggleProjectStatus;
