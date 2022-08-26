export function sortOrder<T extends { order: number }>(tests: T[]): T[] {
  return tests.sort((firstItem, secondItem) => {
    const first = Number(firstItem.order);
    const second = Number(secondItem.order);

    if (first > second) {
      return 1;
    }

    if (first < second) {
      return -1;
    }

    return 0;
  });
}
