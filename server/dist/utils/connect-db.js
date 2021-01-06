"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("mongodb"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
function connectDatabase(app) {
    try {
        const { NODE_ENV } = process.env;
        const dbConfigPath = path_1.default.resolve(process.cwd(), `.${NODE_ENV}.env`);
        const env = dotenv_1.default.config({ path: dbConfigPath }).parsed || {};
        (async () => {
            const mongoClient = await mongodb_1.default.MongoClient.connect(`mongodb://${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}`);
            const $collection = (col) => {
                return mongoClient.db(env.DB_DATABASE).collection(col);
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
        })();
    }
    catch (e) {
        throw e;
    }
}
exports.default = connectDatabase;
