import fsNode from 'fs';
import { configTsconfigType } from '../interfaces/configFile';

export const loadTsConfig = (): configTsconfigType => {
  const fileTsconfig: string = fsNode.readFileSync('./tsconfig.json', { encoding: 'utf-8' });
  return JSON.parse(fileTsconfig);
};
