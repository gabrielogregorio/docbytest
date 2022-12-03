const COMPLETE_TEXT_REGEX: number = 0;

const removeTestCaseExtracted = ({
  completeTextFileText,
  textNextTestCase,
}: {
  completeTextFileText: string;
  textNextTestCase: RegExpExecArray;
}): string => completeTextFileText.replace(textNextTestCase[COMPLETE_TEXT_REGEX], '');

const removeBreakLines = ({ completeTextFileText }: { completeTextFileText: string }): string =>
  completeTextFileText.replace(/^.{0,300}\n/, '');

const testesTwoSpaceLines: RegExp = /^^\s{2}(it|test)\(['"`]\s{0,10}\[doc\]\s{0,10}[:-][\s\S]+?\n\s{2}\}\);\n/;

export const extractTestCasesText = ({ textFileTest }: { textFileTest: string }): string[] => {
  let completeTextFileText: string = `\n${textFileTest}\n`;

  const listAttemptsGetTestCases: number[] = Array.from(Array(completeTextFileText.split('\n').length).keys());

  const allTestCases: string[] = listAttemptsGetTestCases.map(() => {
    const textNextTestCase: RegExpExecArray | null = testesTwoSpaceLines.exec(completeTextFileText);
    if (textNextTestCase) {
      completeTextFileText = removeTestCaseExtracted({ completeTextFileText, textNextTestCase });
      return textNextTestCase[COMPLETE_TEXT_REGEX];
    }

    completeTextFileText = removeBreakLines({ completeTextFileText });
    return '';
  });

  return allTestCases.filter((item: string) => !!item === true);
};
