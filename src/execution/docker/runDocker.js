import { spawn, exec } from "child_process";

export function runDocker({
    containerName,
    image,
    workspace,
    command,
    stdin = "",
    timeout = 5000,
}) {

    return new Promise((resolve, reject) => {

        const dockerArgs = [
            "run",

            "--name",
            containerName,

            "--rm",

            "-i",

            "-v",
            `${workspace}:/app`,

            "-w",
            "/app",

            image,

            ...command,
        ];

        const dockerProcess = spawn("docker", dockerArgs);

        let stdout = "";
        let stderr = "";

        // Send input to the running program
        if (stdin) {
            dockerProcess.stdin.write(stdin);
        }

        dockerProcess.stdin.end();

        const timer = setTimeout(() => {

            exec(`docker kill ${containerName}`, () => {

                reject(
                    new Error(
                        `Execution timed out after ${timeout}ms`
                    )
                );

            });

        }, timeout);

        dockerProcess.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        dockerProcess.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        dockerProcess.on("close", (exitCode) => {

            clearTimeout(timer);

            resolve({
                success: exitCode === 0,
                stdout,
                stderr,
                exitCode,
            });

        });

        dockerProcess.on("error", (error) => {

            clearTimeout(timer);

            reject(error);

        });

    });

}