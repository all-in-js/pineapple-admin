"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("mongodb"));
async function connectDatabase(app) {
    return new Promise((rs, rj) => {
        try {
            const { DB_HOST, DB_PORT, DB_DATABASE } = app.context.db_env;
            const dbURI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
            mongodb_1.default.MongoClient.connect(dbURI, {
                useUnifiedTopology: true
            }, (err, mongoClient) => {
                if (err) {
                    rj(err);
                }
                else {
                    rs(mongoClient);
                }
            });
        }
        catch (e) {
            console.log('err timeout-----------------', e);
            throw e;
        }
    });
}
exports.default = connectDatabase;
