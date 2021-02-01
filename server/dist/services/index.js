"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formidable_1 = require("formidable");
class Upload extends formidable_1.IncomingForm {
    constructor(options) {
        super(options);
        this.key = options.key;
    }
    transform(req) {
        return new Promise((rs, rj) => {
            let res = {};
            try {
                this.parse(req, (err, fields, files) => {
                    res = {
                        err,
                        file: files[this.key]
                    };
                });
            }
            catch (err) {
                res = {
                    err
                };
            }
            rs(res);
        });
    }
}
exports.default = Upload;
app.use(koaUpload({
    uri: 'api/upload',
    formidable: {},
    response(cx, result) {
    }
}));
