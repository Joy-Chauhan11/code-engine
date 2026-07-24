import { execute } from "../execution/engine.js";
import { judge } from "../judge/judge.js";

export async function executeCode(req, res,next) {

    try {

        const result = await execute(req.body);

        return res.json(result);

    } catch (err) {
next(err);
    
    }

}

export async function judgeCode(req, res,next) {

    try {

        const result = await judge(req.body);

        return res.json(result);

    } catch (err) {
  next(err)

    }

}