import fsNode from 'fs';
import { configTsconfig } from '@/interfaces/configFile';

export const loadTsConfig = (): configTsconfig => {
  const fileTsconfig: string = fsNode.readFileSync('./tsconfig.json', { encoding: 'utf-8' });
  return JSON.parse(fileTsconfig);
};
