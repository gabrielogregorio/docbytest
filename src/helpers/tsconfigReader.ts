import fs from 'fs';

export function loadTsConfig() {
  const fileTsconfig = fs.readFileSync('./tsconfig.json', { encoding: 'utf-8' });
  return JSON.parse(fileTsconfig);
}
