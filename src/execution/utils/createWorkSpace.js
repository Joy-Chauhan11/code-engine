import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import os from "os";


export async function createWorkspace() {
  const id = crypto.randomUUID();


const workspace = path.join(
    os.tmpdir(),
    "engine",
    id
);
  await fs.mkdir(workspace, { recursive: true });

  return {id,workspace};
}
