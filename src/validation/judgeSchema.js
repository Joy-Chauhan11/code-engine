import Joi from "joi";

export const judgeSchema = Joi.object({
    language: Joi.string()
        .valid("javascript", "python", "cpp")
        .required(),

    code: Joi.string()
        .required(),

    testCases: Joi.array()
        .items(
            Joi.object({
                input: Joi.string().required(),
                expectedOutput: Joi.string().required()
            })
        )
        .min(1)
        .required()
});