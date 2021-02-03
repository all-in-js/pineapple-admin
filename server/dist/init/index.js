"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_db_env_1 = __importDefault(require("./init-db-env"));
const init_codes_1 = __importDefault(require("./init-codes"));
const connect_db_1 = __importDefault(require("./connect-db"));
const init_collection_1 = __importDefault(require("./init-collection"));
function default_1(app) {
    const dbEnv = init_db_env_1.default();
    app.context.db_env = dbEnv;
    init_codes_1.default(app);
    return connect_db_1.default(app).then((mongoClient) => {
        init_collection_1.default(app, mongoClient);
    });
}
exports.default = default_1;
