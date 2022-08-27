import { configTsconfigType, configTsConfigPathsType } from '@/interfaces/configFile';
import path from 'path';

export const resolvePathAlias = (
  tsconfigWithJson: configTsconfigType,
  aliasToSearch: string,
  importFileWithPathAlias: string,
): string => {
  const removePathAlias: string = importFileWithPathAlias?.replace(aliasToSearch, '');
  const { baseUrl }: { baseUrl: string } = tsconfigWithJson.compilerOptions;
  const compilePathsOptions: configTsConfigPathsType = tsconfigWithJson.compilerOptions.paths;

  return path.join(baseUrl, compilePathsOptions[`${aliasToSearch}/*`][0]?.toString().replace('*', ''), removePathAlias);
};
