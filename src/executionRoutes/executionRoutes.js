import { Router } from "express";
import {
    executeCode,
    judgeCode,
} from "../executionController/executioncontroller.js";
import {validateRequest} from "../middleware/validateRequest.js"
import {executeSchema} from "../validation/executeSchema.js"
import {judgeSchema} from "../validation/judgeSchema.js"

const router = Router();

router.post(
    "/execute",
    validateRequest(executeSchema),
    executeCode
);

router.post(
    "/judge",
    validateRequest(judgeSchema),
    judgeCode
);

export default router;