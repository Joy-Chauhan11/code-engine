function deepEqual(a, b) {
  if (a === b) return true;

  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) < 1e-9;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => deepEqual(val, b[i]));
  }

  if (
    typeof a === "object" && a !== null &&
    typeof b === "object" && b !== null
  ) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) => deepEqual(a[key], b[key]));
  }

  return false;
}

export function compareOutput(actualOutput, expectedOutput) {
  const actual = actualOutput.trim();
  const expected = expectedOutput.trim();

  try {
    const actualParsed = JSON.parse(actual);
    const expectedParsed = JSON.parse(expected);
    return deepEqual(actualParsed, expectedParsed);
  } catch {
    return actual === expected;
  }
}