export function buildHarnessCode(language, userCode, functionName) {
  switch (language) {
    case "javascript":
      return `
${userCode}

const __input = require("fs").readFileSync(0, "utf-8");
const __args = JSON.parse(__input);
const __result = ${functionName}(...__args);
process.stdout.write(JSON.stringify(__result));
`;

    case "python":
      return `
import json, sys

${userCode}

__args = json.loads(sys.stdin.read())
__result = ${functionName}(*__args)
sys.stdout.write(json.dumps(__result))
`;

    default:
      throw new Error(`No harness defined for language: ${language}`);
  }
}