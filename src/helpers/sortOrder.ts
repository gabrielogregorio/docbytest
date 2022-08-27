const IS_EQUAL: number = 0;
const CLASSIFY_A_BEFORE_B: number = -1;
const CLASSIFY_B_BEFORE_A: number = 1;
export const sortOrder = <T extends { order: number }>(tests: T[]): T[] =>
  tests.sort((firstItem: T, secondItem: T) => {
    const first: number = Number(firstItem.order);
    const second: number = Number(secondItem.order);

    if (first > second) {
      return CLASSIFY_B_BEFORE_A;
    }

    if (first < second) {
      return CLASSIFY_A_BEFORE_B;
    }

    return IS_EQUAL;
  });
