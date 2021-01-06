"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
async function projects(cx) {
    const projects = await cx.$project.find().toArray();
    return projects;
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
