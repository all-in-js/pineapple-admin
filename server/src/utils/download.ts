import fs from 'fs-extra';
import contentDisposition from 'content-disposition';
import { resolveHome } from './util';

export function createTempFile(name: string, content: string, suffix?: string) {
  const filepath = resolveHome(`${name}.${suffix || 'js'}`);
  fs.ensureFileSync(filepath);
  fs.writeFileSync(filepath, content);
  return filepath;
}

export default function download(cx: KoaContext, contentType: string, filepath: string) {
  cx.set('Content-Type', contentType);
  cx.set('Content-Disposition', contentDisposition(filepath));
  const stream = fs.createReadStream(filepath);
  cx.body = stream;
}