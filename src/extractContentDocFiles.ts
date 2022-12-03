import fsNode from 'fs';
import { mountMdDocs } from '@/helpers/mountMdDocs';
import { statusCodeConfigType } from '@/interfaces/inputLib';
import { dataDocsType } from '@/interfaces/docs';
import { BIG_SORT_NUMBER } from './constants/variables';

type extractContentDocFilesType = {
  fileDocs: string[];
  statusCode: statusCodeConfigType | null;
};

const TITLE_POSITION: number = 3;
const ORDER_POSITION: number = 2;
const RE_TITLE_AND_ORDER: RegExp = /^#\s{0,10}(\[(\d{1,10})\]\s{0,5}[-\\:\s{0,5}]\s{0,5})?(.{1,100})/;
const RE_SORT_NUMBER: RegExp = /^#\s{0,10}(\[(\d{1,10})\]\s{0,5}[-\\:\s{0,5}]\s{0,5})?/;

export const extractContentDocFiles = ({ fileDocs, statusCode }: extractContentDocFilesType): dataDocsType[] =>
  fileDocs.map((docFile: string) => {
    const docContent: string = fsNode.readFileSync(docFile, { encoding: 'utf-8' });
    const titleAndOrder: RegExpExecArray | null = RE_TITLE_AND_ORDER.exec(docContent);

    const docContentWithoutSortNumber: string = docContent.replace(RE_SORT_NUMBER, '# ');
    const markdownDocs: string = mountMdDocs(docContentWithoutSortNumber, statusCode);

    if (titleAndOrder === null) {
      return { title: '', order: 0, text: markdownDocs };
    }
    return {
      title: titleAndOrder?.[TITLE_POSITION],
      order: Number(titleAndOrder?.[ORDER_POSITION]) || BIG_SORT_NUMBER,
      text: markdownDocs,
    };
  });
