"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function initCollections(app, mongoClient) {
    /**
     * 初始化collection
     */
    const $collection = (col) => {
        return mongoClient.db(app.context.db_env.DB_DATABASE).collection(col);
    };
    const projectModel = $collection('projects');
    app.context.$collection = $collection;
    /**
     * 项目model
     */
    app.context.$project = projectModel;
    /**
     * svg model
     */
    app.context.$svg = $collection('svgs');
    /**
     * user model
     */
    app.context.$user = $collection('users');
}
exports.default = initCollections;
