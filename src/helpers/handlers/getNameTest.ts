const removeDocPrefix = (content: string): string => content.replace(/^\s*\[doc\]\s*[:-]\s*/, '');

const GROUP_POSITION_NAME_TEST: number = 2;

type getNameTestType = { testCaseText: string };

export const getNameTest = ({ testCaseText }: getNameTestType): string => {
  const regex: RegExp = /(it|test)\(['`"](.*?)['`"]/;
  const match: RegExpExecArray | null = regex.exec(testCaseText);
  if (match) {
    return removeDocPrefix(match[GROUP_POSITION_NAME_TEST]);
  }

  return '';
};
