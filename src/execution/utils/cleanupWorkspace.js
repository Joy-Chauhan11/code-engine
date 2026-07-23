import fs from "fs/promises";

export async function cleanupWorkspace(workspace) {
    await fs.rm(workspace, {
        recursive: true,
        force: true,
    });
}