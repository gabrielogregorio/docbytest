import fsNode from 'fs';
import { configTsconfigType } from '../interfaces/configFile';
import { loadTsConfig } from '../helpers/tsconfigReader';
import { resolverJsonFiles } from '../helpers/resolvers';
import { resolvePathAlias } from '../helpers/resolvePathAlias';

const exampleCode: string = `
import jsonIten from '../example/fileStatus.json';
import data3 from '../exampl2_e/fileStatus';
import data4 from '../example/fileStatus.js';
import examplePathAlias from '@/example/fileStatus.json';
import jsonItemq from '../example/fileStatus.json1';
import item_test from '../example/fileStatus.ts';`;

const folderTestPast: string = './src/tests';
describe('Normal Path', () => {
  it('resolve json with exists', () => {
    expect(resolverJsonFiles(exampleCode, 'jsonIten', folderTestPast)).toEqual({
      content: { nome: 'json item' },
      error: '',
    });
  });

  it('json not exists', () => {
    expect(resolverJsonFiles(exampleCode, 'data4', folderTestPast)).toEqual({
      content: null,
      error: 'file not exists',
    });
  });

  it('get path alias available', () => {
    const importFileWithPathAlias: string = '@/example/fileStatus.json';
    const aliasToSearch: string = '@/example';
    const tsconfigWithJson: configTsconfigType = loadTsConfig();
    const pathWithResolveAlias: string = resolvePathAlias(tsconfigWithJson, aliasToSearch, importFileWithPathAlias);
    expect(pathWithResolveAlias).toEqual('src/example/fileStatus.json');
  });

  it('resolve json with path alias', () => {
    const insertTest: string = 'examplePathAlias';
    const reImport: RegExp = new RegExp(`^\\s*import\\s*${insertTest}\\s*from\\s*['"]([\\w\\.\\@\\/]*)['"]`, 'm');
    const GROUP_IMPORT_PATH: number = 1;
    const result: RegExpExecArray = reImport.exec(exampleCode) as RegExpExecArray;
    const folderTest: string = result[GROUP_IMPORT_PATH];

    const tsconfigWithJson: configTsconfigType = loadTsConfig();
    const aliasToSearch: string = '@/example';
    const pathWithResolveAlias: string = resolvePathAlias(tsconfigWithJson, aliasToSearch, folderTest);

    const pathExists: boolean = fsNode.existsSync(pathWithResolveAlias);

    expect(pathExists).toEqual(true);
    const text: string = fsNode.readFileSync(pathWithResolveAlias, { encoding: 'utf-8' });
    expect(text).toEqual(`{\n  "nome": "json item"\n}\n`);
  });
});
