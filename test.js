import { execute } from "./src/execution/engine.js";

async function main() {
    const result = await execute({
        language: "cpp",
        code: `
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b;
}
`,
        stdin: "2 3\n",
    });

    console.log(result);
}

main();