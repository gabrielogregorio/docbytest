import fs from 'fs';
import path from 'path';

export const resolverJsonFiles = (fullCode: string, importDefaultName: string, pathTests: string) => {
  const reImport = new RegExp(`^\\s*import\\s*${importDefaultName}\\s*from\\s*['"]([\\w\\.\\/]*)['"]`, 'm');

  const result = reImport.exec(fullCode);

  const folderTest = result[1];
  const pathFile = path.join(pathTests, folderTest);

  const pathFileExists = fs.existsSync(pathFile);
  if (!pathFileExists) {
    return { error: 'file not exists', content: '' };
  }

  const text = fs.readFileSync(pathFile, { encoding: 'utf-8' });
  return { error: '', content: JSON.parse(text) };
};
