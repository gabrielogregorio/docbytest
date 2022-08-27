import { configTsconfig } from '@/interfaces/configFile';
import fsNode from 'fs';
import path from 'path';
import { resolvePathAlias } from './resolvePathAlias';
import { loadTsConfig } from './tsconfigReader';

export const resolverJsonFiles = (
  fullCode: string,
  importDefaultName: string,
  pathTests: string,
): { error: string; content: object } => {
  const reImport: RegExp = new RegExp(`^\\s*import\\s*${importDefaultName}\\s*from\\s*['"]([\\w@\\.\\/]*)['"]`, 'm');

  const result: RegExpExecArray = reImport.exec(fullCode);
  const folderTest: string = result[1];

  let pathFile: string = '';

  const isAbsolutePath: boolean = !folderTest.startsWith('.');
  if (isAbsolutePath) {
    const tsconfigWithJson: configTsconfig = loadTsConfig();
    const RE_GET_FIRST_RELATIVE_PATH: RegExp = /([@]?[\\/]?[\d\w_]{1,})/;
    const aliasToSearch: RegExpExecArray = RE_GET_FIRST_RELATIVE_PATH.exec(folderTest);
    pathFile = resolvePathAlias(tsconfigWithJson, aliasToSearch?.[1], folderTest);
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
