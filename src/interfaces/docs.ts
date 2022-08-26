export type dataDocsType = {
  title: string;
  order: number;
  text: string;
};

export type getDocsType = {
  title: string;
  order: number;
  docs: dataDocsType[];
};
