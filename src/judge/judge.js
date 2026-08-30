import { execute } from "../execution/engine.js";
import { compareOutput } from "./compareOutput.js";
import { STATUS } from "./status.js";
import { EXECUTION_ERROR } from "../execution/err.js";
import { buildHarnessCode } from "../execution/harness.js";
import { LANGUAGES } from "../execution/languages.js";

export async function judge({ language, code, testCases, functionName }) {

    const langConfig = LANGUAGES[language];

    if (!langConfig) {
        throw new Error(`Unsupported language: ${language}`);
    }

    if (langConfig.supportedForJudge === false) {
        return {
            status: STATUS.RUNTIME_ERROR,
            success: false,
            message: `${language} is not yet supported for submission.`,
            passed: 0,
            total: testCases.length,
            results: [],
        };
    }

    const results = [];
    const harnessCode = buildHarnessCode(language, code, functionName);

    for (const testCase of testCases) {

        const executionResult = await execute({
            language,
            code: harnessCode,
            stdin: JSON.stringify(testCase.input.args),
        });

        if (executionResult.stage === "compile") {
            return {
                status: STATUS.COMPILATION_ERROR,
                ...executionResult,
            };
        }

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
            JSON.stringify(testCase.expectedOutput)
        );

        results.push({
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: executionResult.stdout,
            passed,
        });

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
