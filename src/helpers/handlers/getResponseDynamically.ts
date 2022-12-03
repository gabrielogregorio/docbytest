import { LIMIT_PREVENT_INFINITE_LOOPS } from '../../constants/variables';
import { contentRequestType } from '../../interfaces/extractData';
import { dynamicAssembly } from '../dynamicAssembly';
import { findValueInCode } from '../findValueInCode';
import { mergeRecursive } from '../mergeRecursive';

const START_POSITION: number = 0;

const mountDynamicObject = ({
  expectedResponse,
  command,
  completeObject,
  oneTestText,
  pathFull,
}: {
  expectedResponse: string;
  command: string;
  completeObject: object;
  oneTestText: string;
  pathFull: string;
}): object => {
  let valueExtracted: contentRequestType = findValueInCode(expectedResponse.replace(/'/gi, '"'), oneTestText, pathFull);
  if (typeof valueExtracted === 'string' && valueExtracted[START_POSITION] !== '"') {
    valueExtracted = `"${valueExtracted}"`;
  }
  const transform: string = dynamicAssembly(command, valueExtracted);

  return mergeRecursive(completeObject, JSON.parse(transform.replace(/'/g, '"')));
};

const INCREMENT_DYNAMIC_POSITION: number = 1;
const GROUP_COMMAND_POSITION: number = 1;
const GROUP_VALUE_POSITION: number = 2;

type tryIncrementOrReturnSelfType = {
  expectedResponse: string;
  command: string;
  completeObject: object;
  textFileTest: string;
  directoryAllTests: string;
};

const tryIncrementOrReturnSelf = ({
  expectedResponse,
  command,
  completeObject,
  textFileTest,
  directoryAllTests,
}: tryIncrementOrReturnSelfType): object => {
  try {
    return mountDynamicObject({
      expectedResponse,
      command,
      completeObject,
      oneTestText: textFileTest,
      pathFull: directoryAllTests,
    });
  } catch (error: unknown) {
    return completeObject;
  }
};

export const getResponseDynamically = ({
  testCaseText,
  textFileTest,
  object,
  directoryAllTests,
}: {
  testCaseText: string;
  textFileTest: string;
  object: object;
  directoryAllTests: string;
}): object => {
  const completeObject: object = object;
  const regexDynamicBody: RegExp = /expect\(\w{1,300}\.(body[^)]+)\)\.toEqual\(([^)]{1,9999})/gi;

  for (let increment: number = 0; increment <= LIMIT_PREVENT_INFINITE_LOOPS; increment += INCREMENT_DYNAMIC_POSITION) {
    const regexRouter: RegExpExecArray | null = regexDynamicBody.exec(testCaseText);

    if (regexRouter) {
      const command: string = regexRouter[GROUP_COMMAND_POSITION];
      const expectedResponse: string = regexRouter[GROUP_VALUE_POSITION];

      const isFunctionFromObject: boolean = !command.endsWith('length');
      if (isFunctionFromObject) {
        tryIncrementOrReturnSelf({ expectedResponse, command, completeObject, textFileTest, directoryAllTests });
      }
    }

    if (!regexRouter) {
      break;
    }
  }

  return completeObject;
};
