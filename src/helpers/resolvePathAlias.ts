import path from 'path';
import { configTsconfigType, configTsConfigPathsType } from '@/interfaces/configFile';

const FIRST_OPTION_ALIAS: number = 0;

export const resolvePathAlias = (
  tsconfigWithJson: configTsconfigType,
  aliasToSearch: string,
  importFileWithPathAlias: string,
): string => {
  const removePathAlias: string = importFileWithPathAlias?.replace(aliasToSearch, '');
  const { baseUrl }: { baseUrl: string } = tsconfigWithJson.compilerOptions;
  const compilePathsOptions: configTsConfigPathsType = tsconfigWithJson.compilerOptions.paths;

  return path.join(
    baseUrl,
    compilePathsOptions[`${aliasToSearch}/*`][FIRST_OPTION_ALIAS]?.toString().replace('*', ''),
    removePathAlias,
  );
};
