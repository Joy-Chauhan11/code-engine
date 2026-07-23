import { LANGUAGES } from "./languages.js";
import { createWorkspace } from "./utils/createWorkspace.js";
import { writeCodeToFile } from "./utils/writeCodeToFile.js";
import { cleanupWorkspace } from "./utils/cleanupWorkspace.js";
import { runDocker } from "./docker/runDocker.js";

export async function execute({
    language,
    code,
    stdin = "",
}) {
    const config = LANGUAGES[language];

    if (!config) {
        throw new Error(`Unsupported language: ${language}`);
    }

    const { id, workspace } = await createWorkspace();

    try {
        const { fileName } = await writeCodeToFile(
            workspace,
            language,
            code
        );

        // -----------------------
        // Compile (if required)
        // -----------------------
        if (config.compile) {

            const compileResult = await runDocker({
                containerName: `compile-${id}`,
                image: config.image,
                workspace,
                command: config.compile(fileName),
                timeout: 5000,
            });


            if (!compileResult.success) {
                return {
                    stage: "compile",
                    ...compileResult,
                };
            }
        }

        // -----------------------
        // Run
        // -----------------------
        const runResult = await runDocker({
            containerName: `execution-${id}`,
            image: config.image,
            workspace,
            command: config.run(fileName),
            timeout: 5000,
        });

        return {
            stage: "run",
            ...runResult,
        };

    } finally {
        await cleanupWorkspace(workspace);
    }
}