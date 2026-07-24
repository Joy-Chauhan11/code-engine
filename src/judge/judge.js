import { execute } from "../execution/engine.js";
import { compareOutput } from "./compareOutput.js";
import { STATUS } from "./status.js";
import { EXECUTION_ERROR } from "../execution/err.js";


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

        // Compilation Error
        if (executionResult.stage === "compile") {
            return {
                status: STATUS.COMPILATION_ERROR,
                ...executionResult,
            };
        }

        // Runtime Error / Timeout
        if (!executionResult.success) {

            if (executionResult.reason === EXECUTION_ERROR.TIMEOUT) {
    return {
        status: STATUS.TIME_LIMIT_EXCEEDED,
        ...executionResult,
    };
}

            return {
                status: STATUS.RUNTIME_ERROR,
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

        // Fail Fast
        if (!passed) {

            return {
                status: STATUS.WRONG_ANSWER,
                passed: results.filter(r => r.passed).length,
                total: testCases.length,
                results,
            };

        }
    }

    return {
        status: STATUS.ACCEPTED,
        passed: testCases.length,
        total: testCases.length,
        results,
    };

}