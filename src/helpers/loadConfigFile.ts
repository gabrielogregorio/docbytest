import fsNode from 'fs';
import { configFileType } from '../interfaces/configFile';

export const loadConfigFile = (file: string): configFileType => {
  const configFile: string = fsNode.readFileSync(file, { encoding: 'utf-8' });

  return JSON.parse(configFile);
};
