import fsNode from 'fs';
import { configTsconfig } from '@/interfaces/configFile';
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
    const tsconfigWithJson: configTsconfig = loadTsConfig();
    const fullPathWithResolveAlias: string = resolvePathAlias(tsconfigWithJson, aliasToSearch, importFileWithPathAlias);
    expect(fullPathWithResolveAlias).toEqual('src/example/fileStatus.json');
  });

  it('resolve json with path alias', () => {
    const insertTest: string = 'examplePathAlias';
    const reImport: RegExp = new RegExp(`^\\s*import\\s*${insertTest}\\s*from\\s*['"]([\\w\\.\\@\\/]*)['"]`, 'm');

    const result: RegExpExecArray = reImport.exec(exampleCode);
    const folderTest: string = result[1];

    const tsconfigWithJson: configTsconfig = loadTsConfig();
    const aliasToSearch: string = '@/example';
    const fullPathWithResolveAlias: string = resolvePathAlias(tsconfigWithJson, aliasToSearch, folderTest);

    const pathExists: boolean = fsNode.existsSync(fullPathWithResolveAlias);

    expect(pathExists).toEqual(true);
    const text: string = fsNode.readFileSync(fullPathWithResolveAlias, { encoding: 'utf-8' });
    expect(text).toEqual(`{\n  "nome": "json item"\n}\n`);
  });
});
