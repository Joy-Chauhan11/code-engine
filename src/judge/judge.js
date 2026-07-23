import { execute } from "../execution/engine.js";
import { compareOutput } from "./compareOutput.js";

export async function judge({
    language,
    code,
    testCases,
}) {

    const results = [];

    for (const testCase of testCases) {

        const executionResult = await execute({
            language,
            code,
            stdin: testCase.input,
        });

        // If compilation/runtime/timeout failed
        if (!executionResult.success) {
            return {
                success: false,
                stage: executionResult.stage,
                ...executionResult,
            };
        }

        const passed = compareOutput(
            executionResult.stdout,
            testCase.expectedOutput
        );

        results.push({
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: executionResult.stdout,
            passed,
        });
    }

    const passedCount = results.filter(r => r.passed).length;

    return {
        success: passedCount === results.length,
        passed: passedCount,
        total: results.length,
        results,
    };

}