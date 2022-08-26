import path from 'path';

export const resolvePathAlias = (tsconfigWithJson, aliasToSearch: string, importFileWithPathAlias: string): string => {
  const removePathAlias = importFileWithPathAlias?.replace(aliasToSearch, '');
  const { baseUrl } = tsconfigWithJson.compilerOptions;
  const compilePathsOptions = tsconfigWithJson.compilerOptions.paths;

  return path.join(baseUrl, compilePathsOptions[`${aliasToSearch}/*`][0]?.toString().replace('*', ''), removePathAlias);
};
