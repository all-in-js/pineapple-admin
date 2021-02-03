"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
function initDBenv() {
    const { NODE_ENV } = process.env;
    const dbConfigPath = path_1.default.resolve(process.cwd(), `.${NODE_ENV}.env`);
    const env = dotenv_1.default.config({ path: dbConfigPath }).parsed || {};
    return env;
}
exports.default = initDBenv;
