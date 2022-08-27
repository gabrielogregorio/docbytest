export type configFileType = {
  folderTests: string;
  docFile: string;
  statusCodeErrorFile: string;
};

export type configTsConfigPaths = {
  [key: string]: string[];
};

export type configTsconfig = {
  compilerOptions: {
    paths: configTsConfigPaths;
    baseUrl: string;
  };
};
