import { Router } from "express";
import {
    executeCode,
    judgeCode,
} from "../executionController/executioncontroller.js";

const router = Router();

router.post("/execute", executeCode);

router.post("/judge", judgeCode);

export default router;