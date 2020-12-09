import http from 'http';
import { IncomingForm, File } from 'formidable';

type Options = {
  [key: string]: any
}
export default class Upload extends IncomingForm {
  private key: string;
  constructor(options: Options) {
    super(options);
    this.key = options.key;
  }
  transform(req: http.IncomingMessage): Promise<File> {
    return new Promise((rs, rj) => {
      try {
        this.parse(req, (err, fields, files) => {
          if (err) {
            rj(err);
          } else {
            rs(files[this.key]);
          }
        });
      } catch(e) {
        rj(e);
      }  
    });
  }
}
