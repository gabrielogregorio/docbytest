import fs from 'fs';
import path from 'path';

const exampleCode = `
import jsonIten from '../example/fileStatus.json';
import data3 from '../exampl2_e/fileStatus';
import data4 from '../example/fileStatus.js';
import jsonItemq from '../example/fileStatus.json1';
import item_test from '../example/fileStatus.ts';`;

const folderTestPast = './src/tests';
describe('Suite', () => {
  it('resolve json with exists', () => {
    const insertTest = 'jsonIten';
    const reImport = new RegExp(`^\\s*import\\s*${insertTest}\\s*from\\s*['"]([\\w\\.\\/]*)['"]`, 'm');

    const result = reImport.exec(exampleCode);

    const folderTest = result[1];
    const pathFile = path.join(folderTestPast, folderTest);

    const pathExists = fs.existsSync(pathFile);
    expect(pathExists).toEqual(true);
    const text = fs.readFileSync(pathFile, { encoding: 'utf-8' });
    expect(text).toEqual(`{\n  "nome": "json item"\n}\n`);
  });

  it('json not exists', () => {
    const insertTest = 'data4';
    const reImport = new RegExp(`^\\s*import\\s*${insertTest}\\s*from\\s*['"]([\\w\\.\\/]*)['"]`, 'm');
    const result = reImport.exec(exampleCode);

    const folderTest = result[1];
    const pathFile = path.join(folderTestPast, folderTest);

    const pathExists = fs.existsSync(pathFile);
    expect(pathExists).toEqual(false);
  });
});
