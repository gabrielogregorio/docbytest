import fsNode from 'fs';
import { configFileType } from '@/interfaces/configFile';

export function loadTsConfig(): configFileType {
  const fileTsconfig = fsNode.readFileSync('./tsconfig.json', { encoding: 'utf-8' });
  return JSON.parse(fileTsconfig);
}
