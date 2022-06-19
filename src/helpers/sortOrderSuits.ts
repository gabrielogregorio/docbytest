export function sortOrderSuits(tests) {
  return tests.sort((a, b) => {
    const first = Number(a.order);
    const second = Number(b.order);

    if (first > second) {
      return 1;
    }

    if (first < second) {
      return -1;
    }

    return 0;
  });
}
