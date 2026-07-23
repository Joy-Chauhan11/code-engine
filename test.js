import { execute } from "./src/execution/engine.js";

async function main() {

    
  const result=  await execute({
    language: "javascript",   
    code: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8");

console.log(Number(input) * 2);
`,
 stdin:"12"
});

    console.log(result);

}

main();