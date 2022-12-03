import { LIMIT_PREVENT_INFINITE_LOOPS } from '../../constants/variables';
import { IParameters, ParametersInEnum } from '../../interfaces/extractData';
import { getTypeVariable } from './getTypeVariable';

const INCREMENT_PREVENT_LOOP: number = 1;
const GROUP_POSITION_NAME_TAG: number = 1;
export const getParameters = ({
  testCaseText,
  textFileTest,
}: {
  testCaseText: string;
  textFileTest: string;
}): IParameters[] => {
  const parameters: IParameters[] = [];
  const regexParameters: RegExp = /\/\$\{(\w*)\}/gi;

  let preventLoop: number = 0;
  while (true) {
    preventLoop += INCREMENT_PREVENT_LOOP;
    if (LIMIT_PREVENT_INFINITE_LOOPS === preventLoop) {
      break;
    }

    const regexRouter: RegExpExecArray | null = regexParameters.exec(testCaseText);

    if (regexRouter) {
      const nameTag: string = regexRouter[GROUP_POSITION_NAME_TAG];

      parameters.push({
        name: nameTag,
        variable: nameTag,
        in: ParametersInEnum.param,
        type: getTypeVariable(nameTag, textFileTest).type,
        example: getTypeVariable(nameTag, textFileTest).content,
      });
    }

    if (!regexRouter) {
      break;
    }
  }
  return parameters;
};
