import fsNode from 'fs';
import { configFileType } from '../interfaces/configFile';

export function loadConfigFile(file: string): configFileType {
  const configFile = fsNode.readFileSync(file, { encoding: 'utf-8' });

  return JSON.parse(configFile);
}
