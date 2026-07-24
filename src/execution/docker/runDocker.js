import { spawn, exec } from "child_process";
import { EXECUTION_ERROR } from "../err.js";


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
console.log("Command:", command);
console.log("STDIN:", JSON.stringify(stdin));
        const dockerProcess = spawn("docker", dockerArgs);

        let stdout = "";
        let stderr = "";

        // Send input to the running program
        if (stdin) {
            dockerProcess.stdin.write(stdin);
        }

        dockerProcess.stdin.end();

        let timedOut = false;
        const timer = setTimeout(() => {
    timedOut = true;

    dockerProcess.kill();

    resolve({
        success: false,
        reason: EXECUTION_ERROR.TIMEOUT,
        stdout,
        stderr: `Execution timed out after ${timeout}ms`,
        exitCode: null,
    });

}, timeout);

        dockerProcess.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        dockerProcess.stderr.on("data", (data) => {
            stderr += data.toString();
        });

       dockerProcess.on("close", (exitCode) => {

    if (timedOut) return;

    clearTimeout(timer);

    resolve({
        success: exitCode === 0,
        reason:
            exitCode === 0
                ? EXECUTION_ERROR.NONE
                : EXECUTION_ERROR.RUNTIME_ERROR,
        stdout,
        stderr,
        exitCode,
    });

});
dockerProcess.on("error", (err) => {

    clearTimeout(timer);

    resolve({
        success: false,
        reason: EXECUTION_ERROR.DOCKER_ERROR,
        stdout: "",
        stderr: err.message,
        exitCode: null,
    });

});
    });

}