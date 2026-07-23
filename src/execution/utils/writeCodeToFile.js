import fs from "fs/promises";
import path from "path";
import { LANGUAGES } from "../languages.js";

export async function writeCodeToFile(workspace, language, code) {

    const config = LANGUAGES[language];

    if (!config) {
        throw new Error("Unsupported language");
    }

    const fileName =
        language === "java"
            ? "Main.java"
            : `main.${config.extension}`;

    const filePath = path.join(workspace, fileName);

    await fs.writeFile(filePath, code);

    return {
        fileName,
        filePath,
    };
}