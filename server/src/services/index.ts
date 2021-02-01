import http from 'http';
import { IncomingForm, File, Fields } from 'formidable';

interface UploadedResult {
  file?: File;
  err?: any;
}
export default class Upload extends IncomingForm {
  private key: string;
  constructor(options: any) {
    super(options);
    this.key = options.key;
  }
  transform(req: http.IncomingMessage): Promise<UploadedResult> {
    return new Promise((rs, rj) => {
      let res: UploadedResult = {};
      try {
        this.parse(req, (err, fields, files) => {
          res = {
            err,
            file: files[this.key] as File
          };
        });
      } catch(err) {
        res = {
          err
        };
      }
      rs(res);
    });
  }
}

app.use(koaUpload({
  uri: 'api/upload',
  formidable: {},
  response(cx, result) {

  }
}))