"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("mongodb"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
var CodesKey;
(function (CodesKey) {
    CodesKey["UNKNOW"] = "UNKNOW";
    CodesKey["SUCCESS"] = "SUCCESS";
    CodesKey["INNER_ERROR"] = "INNER_ERROR";
    CodesKey["INVALID_PARAMS_TYPE"] = "INVALID_PARAMS_TYPE";
    CodesKey["INNERT_ERROR"] = "INNERT_ERROR";
    CodesKey["DELETE_ERROR"] = "DELETE_ERROR";
    CodesKey["UPDATE_ERROR"] = "UPDATE_ERROR";
    CodesKey["QUERY_ERROR"] = "QUERY_ERROR";
    CodesKey["NOT_FOUND"] = "NOT_FOUND";
    CodesKey["RESOURCE_REPEAT"] = "RESOURCE_REPEAT";
    CodesKey["INVALID_REQUEST_PARAMS"] = "INVALID_REQUEST_PARAMS";
})(CodesKey || (CodesKey = {}));
function connectDatabase(app) {
    try {
        const { NODE_ENV } = process.env;
        const dbConfigPath = path_1.default.resolve(process.cwd(), `.${NODE_ENV}.env`);
        const env = dotenv_1.default.config({ path: dbConfigPath }).parsed || {};
        (async () => {
            const mongoClient = await mongodb_1.default.MongoClient.connect(`mongodb://${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}`, {
                useUnifiedTopology: true
            });
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
            /**
             * user model
             */
            app.context.$user = $collection('users');
            /**
             * init codes
             * 系统级：10--
             * 数据级: 20--
             * 业务级：30--
             */
            app.context.codes = {
                [CodesKey.SUCCESS]: {
                    code: 1000,
                    msg: CodesKey.SUCCESS
                },
                [CodesKey.UNKNOW]: {
                    code: 1001,
                    msg: CodesKey.UNKNOW
                },
                [CodesKey.INNER_ERROR]: {
                    code: 1002,
                    msg: CodesKey.INNER_ERROR
                },
                [CodesKey.INVALID_PARAMS_TYPE]: {
                    code: 2001,
                    msg: CodesKey.INVALID_PARAMS_TYPE
                },
                [CodesKey.INNERT_ERROR]: {
                    code: 2002,
                    msg: CodesKey.INNERT_ERROR
                },
                [CodesKey.DELETE_ERROR]: {
                    code: 2003,
                    msg: CodesKey.DELETE_ERROR
                },
                [CodesKey.UPDATE_ERROR]: {
                    code: 2004,
                    msg: CodesKey.UPDATE_ERROR
                },
                [CodesKey.QUERY_ERROR]: {
                    code: 2005,
                    msg: CodesKey.QUERY_ERROR
                },
                [CodesKey.NOT_FOUND]: {
                    code: 2006,
                    msg: CodesKey.NOT_FOUND
                },
                [CodesKey.RESOURCE_REPEAT]: {
                    code: 2007,
                    msg: CodesKey.RESOURCE_REPEAT
                },
                [CodesKey.INVALID_REQUEST_PARAMS]: {
                    code: 3001,
                    msg: CodesKey.INVALID_REQUEST_PARAMS
                }
            };
        })();
    }
    catch (e) {
        console.log('err timeout-----------------', e);
        throw e;
    }
}
exports.default = connectDatabase;
