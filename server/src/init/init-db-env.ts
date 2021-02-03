import Dotenv from 'dotenv';
import path from 'path';

export default function initDBenv() {
  const { NODE_ENV } = process.env;
  const dbConfigPath = path.resolve(process.cwd(), `.${NODE_ENV}.env`);
  const env = Dotenv.config({ path: dbConfigPath }).parsed || {};
  return env;
}