import crypto from "crypto";

export function generateExecutionId() {
    return `execution-${crypto.randomUUID()}`;
}