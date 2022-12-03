const GROUP_POSITION_DESCRIPTION: number = 2;
export const getDescriptionTest = ({ testCaseText }: { testCaseText: string }): string => {
  const regex: RegExp = /(it|test).*\n\s*\/\*\s*doc\s*[:-]\s*([^\\*]*)/;
  const match: RegExpExecArray | null = regex.exec(testCaseText);
  if (match) {
    return match[GROUP_POSITION_DESCRIPTION].trim();
  }
  return '';
};
