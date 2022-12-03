const GROUP_POSITION_DESCRIBE_SUITE: number = 1;

export const getDescriptionSuite = ({ textFileTest }: { textFileTest: string }): string => {
  const regex: RegExp = /describe.*\n\s*\/\*\s*doc\s*[:-]\s*([^\\*]*)/;
  const match: RegExpExecArray | null = regex.exec(textFileTest);
  if (match) {
    return match[GROUP_POSITION_DESCRIBE_SUITE].trim();
  }
  return '';
};
