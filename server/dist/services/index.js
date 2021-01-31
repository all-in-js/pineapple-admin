"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formidable_1 = __importDefault(require("formidable"));
class Upload extends formidable_1.default {
    constructor(options) {
        super(options);
        this.key = options.key;
    }
    transform(req) {
        return new Promise((rs, rj) => {
            try {
                this.parse(req, (err, fields, files) => {
                    if (err) {
                        rj(err);
                    }
                    else {
                        rs({
                            files: files[this.key],
                            fields
                        });
                    }
                });
            }
            catch (e) {
                rj(e);
            }
        });
    }
}
exports.default = Upload;
