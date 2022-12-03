const DEFAULT_STATUS_CODE: number = 0;
const GROUP_STATUS_CODE_POSITION: number = 3;
export const getStatusCode = ({ testCaseText }: { testCaseText: string }): number => {
  const RE_EXPECTED_STATUS_CODE: RegExp =
    /expect\(([\w\d]{1,50}\.statusCode)\)[\\.\n]*(toEqual|toStrictEqual|toMatchObject|toBe)\(\s{0,20}(\d{3})\s{0,20}\)/;

  const matchExpectedStatusCode: RegExpExecArray | null = RE_EXPECTED_STATUS_CODE.exec(testCaseText);
  if (matchExpectedStatusCode) {
    return Number(matchExpectedStatusCode[GROUP_STATUS_CODE_POSITION]);
  }
  return DEFAULT_STATUS_CODE;
};
