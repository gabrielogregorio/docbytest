import fs from 'fs';
import { loadTsConfig } from '../helpers/tsconfigReader';
import { resolverJsonFiles } from '../helpers/resolvers';
import { resolvePathAlias } from '../helpers/resolvePathAlias';

const exampleCode = `
import jsonIten from '../example/fileStatus.json';
import data3 from '../exampl2_e/fileStatus';
import data4 from '../example/fileStatus.js';
import examplePathAlias from '@/example/fileStatus.json';
import jsonItemq from '../example/fileStatus.json1';
import item_test from '../example/fileStatus.ts';`;

const folderTestPast = './src/tests';
describe('Normal Path', () => {
  it('resolve json with exists', () => {
    expect(resolverJsonFiles(exampleCode, 'jsonIten', folderTestPast)).toEqual({
      content: { nome: 'json item' },
      error: '',
    });
  });

  it('json not exists', () => {
    expect(resolverJsonFiles(exampleCode, 'data4', folderTestPast)).toEqual({
      content: '',
      error: 'file not exists',
    });
  });

  it('get path alias available', () => {
    const importFileWithPathAlias = '@/example/fileStatus.json';
    const aliasToSearch = '@/example';
    const tsconfigWithJson = loadTsConfig();
    const fullPathWithResolveAlias = resolvePathAlias(tsconfigWithJson, aliasToSearch, importFileWithPathAlias);
    expect(fullPathWithResolveAlias).toEqual('src/example/fileStatus.json');
  });

  it('resolve json with path alias', () => {
    const insertTest = 'examplePathAlias';
    const reImport = new RegExp(`^\\s*import\\s*${insertTest}\\s*from\\s*['"]([\\w\\.\\@\\/]*)['"]`, 'm');

    const result = reImport.exec(exampleCode);
    const folderTest = result[1];

    const tsconfigWithJson = loadTsConfig();
    const aliasToSearch = '@/example';
    const fullPathWithResolveAlias = resolvePathAlias(tsconfigWithJson, aliasToSearch, folderTest);

    const pathExists = fs.existsSync(fullPathWithResolveAlias);

    expect(pathExists).toEqual(true);
    const text = fs.readFileSync(fullPathWithResolveAlias, { encoding: 'utf-8' });
    expect(text).toEqual(`{\n  "nome": "json item"\n}\n`);
  });
});
