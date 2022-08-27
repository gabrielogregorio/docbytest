export type configFileType = {
  folderTests: string;
  docFile: string;
  statusCodeErrorFile: string;
};

export type configTsConfigPathsType = {
  [key: string]: string[];
};

export type configTsconfigType = {
  compilerOptions: {
    paths: configTsConfigPathsType;
    baseUrl: string;
  };
};
