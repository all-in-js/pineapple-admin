import os from 'os';
import path from 'path';

export * from 'fs-extra';

export function getHomedir() {
  return (typeof os.homedir == 'function' ? os.homedir() :
  process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME']) || '~';
}

export function resolveHome(...target: string[]): string {
  target.unshift(getHomedir());
  return path.resolve(...target);
}