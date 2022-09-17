import fsNode from 'fs';
import path from 'path';
import { configTsconfigType } from '../interfaces/configFile';
import { resolvePathAlias } from './resolvePathAlias';
import { loadTsConfig } from './tsconfigReader';

const GROUP_POSITION_IMPORT_PATH: number = 1;
const GROUP_POSITION_ALIAS_TS_CONFIG: number = 1;
export const resolverJsonFiles = (
  fullCode: string,
  importDefaultName: string,
  pathTests: string,
): { error: string; content: object } => {
  const reImport: RegExp = new RegExp(`^\\s*import\\s*${importDefaultName}\\s*from\\s*['"]([\\w@\\.\\/]*)['"]`, 'm');

  const result: RegExpExecArray = reImport.exec(fullCode);

  const folderTest: string = result[GROUP_POSITION_IMPORT_PATH];

  let pathFile: string = '';

  const isAbsolutePath: boolean = !folderTest.startsWith('.');
  if (isAbsolutePath) {
    const tsconfigWithJson: configTsconfigType = loadTsConfig();
    const RE_GET_FIRST_RELATIVE_PATH: RegExp = /([@]?[\\/]?[\d\w_]{1,})/;
    const aliasToSearch: RegExpExecArray = RE_GET_FIRST_RELATIVE_PATH.exec(folderTest);
    pathFile = resolvePathAlias(tsconfigWithJson, aliasToSearch?.[GROUP_POSITION_ALIAS_TS_CONFIG], folderTest);
  } else {
    pathFile = path.join(pathTests, folderTest);
  }

  const pathFileExists: boolean = fsNode.existsSync(pathFile);
  if (!pathFileExists) {
    return { error: 'file not exists', content: null };
  }

  const text: string = fsNode.readFileSync(pathFile, { encoding: 'utf-8' });
  return { error: '', content: JSON.parse(text) };
};
