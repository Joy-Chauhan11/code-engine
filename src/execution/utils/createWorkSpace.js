import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function createWorkspace() {
  const id = crypto.randomUUID();

  const workspace = path.join(process.cwd(), "src", "execution", "temp", id);

  await fs.mkdir(workspace, { recursive: true });

  return {id,workspace};
}
