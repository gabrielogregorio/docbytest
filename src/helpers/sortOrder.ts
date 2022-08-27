export const sortOrder = <T extends { order: number }>(tests: T[]): T[] =>
  tests.sort((firstItem: T, secondItem: T) => {
    const first: number = Number(firstItem.order);
    const second: number = Number(secondItem.order);

    if (first > second) {
      return 1;
    }

    if (first < second) {
      return -1;
    }

    return 0;
  });
