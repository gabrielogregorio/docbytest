import fs from 'fs';
import path from 'path';
import { resolvePathAlias } from './resolvePathAlias';
import { loadTsConfig } from './tsconfigReader';

export const resolverJsonFiles = (fullCode: string, importDefaultName: string, pathTests: string) => {
  const reImport = new RegExp(`^\\s*import\\s*${importDefaultName}\\s*from\\s*['"]([\\w@\\.\\/]*)['"]`, 'm');

  const result = reImport.exec(fullCode);
  const folderTest = result[1];

  let pathFile = '';

  const isAbsolutePath = !folderTest.startsWith('.');
  if (isAbsolutePath) {
    // TODO: refactor this function
    const tsconfigWithJson = loadTsConfig();
    const RE_GET_FIRST_RELATIVE_PATH = /([@]?[\\/]?[\d\w_]{1,})/;
    const aliasToSearch = RE_GET_FIRST_RELATIVE_PATH.exec(folderTest);
    pathFile = resolvePathAlias(tsconfigWithJson, aliasToSearch?.[1], folderTest);
  } else {
    pathFile = path.join(pathTests, folderTest);
  }

  const pathFileExists = fs.existsSync(pathFile);
  if (!pathFileExists) {
    return { error: 'file not exists', content: '' };
  }

  const text = fs.readFileSync(pathFile, { encoding: 'utf-8' });
  return { error: '', content: JSON.parse(text) };
};
