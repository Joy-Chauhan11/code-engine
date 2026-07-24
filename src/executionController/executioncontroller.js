import { execute } from "../execution/engine.js";
import { judge } from "../judge/judge.js";

export async function executeCode(req, res) {

    try {

        const result = await execute(req.body);

        return res.json(result);

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

}

export async function judgeCode(req, res) {

    try {

        const result = await judge(req.body);

        return res.json(result);

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }

}