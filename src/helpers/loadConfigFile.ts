import fsNode from 'fs';
import { configFileType } from '../interfaces/configFile';

export const CONFIG_FILE_NAME: string = './docbytest.config.json';

export const loadConfigFile = (): configFileType => {
  const configFile: string = fsNode.readFileSync(CONFIG_FILE_NAME, { encoding: 'utf-8' });

  return JSON.parse(configFile);
};
