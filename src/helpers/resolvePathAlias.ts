import { configTsconfig, configTsConfigPaths } from '@/interfaces/configFile';
import path from 'path';

export const resolvePathAlias = (
  tsconfigWithJson: configTsconfig,
  aliasToSearch: string,
  importFileWithPathAlias: string,
): string => {
  const removePathAlias: string = importFileWithPathAlias?.replace(aliasToSearch, '');
  const { baseUrl }: { baseUrl: string } = tsconfigWithJson.compilerOptions;
  const compilePathsOptions: configTsConfigPaths = tsconfigWithJson.compilerOptions.paths;

  return path.join(baseUrl, compilePathsOptions[`${aliasToSearch}/*`][0]?.toString().replace('*', ''), removePathAlias);
};
