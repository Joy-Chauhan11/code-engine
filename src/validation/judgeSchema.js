import Joi from "joi";

export const judgeSchema = Joi.object({
    language: Joi.string()
        .valid("javascript", "python", "cpp")
        .required(),

    code: Joi.string()
        .required(),

    functionName: Joi.string()
        .required(),

    testCases: Joi.array()
        .items(
            Joi.object({
                input: Joi.object({
                    args: Joi.array().required()
                }).required(),

              
                expectedOutput: Joi.any().required()
            })
        )
        .min(1)
        .required()
});