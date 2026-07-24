import Joi from "joi";

export const executeSchema = Joi.object({
    language: Joi.string()
        .valid("javascript", "python", "cpp")
        .required(),

    code: Joi.string()
        .min(1)
        .required(),

    stdin: Joi.string()
        .allow("")
        .default("")
});