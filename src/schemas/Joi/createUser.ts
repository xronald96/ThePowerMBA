import Joi from 'joi';
export const createUserSchema = Joi.object().keys({
	name: Joi.string().alphanum().min(3).max(30).required(),
	surname: Joi.string().min(3).max(30).required(),
	age: Joi.number().min(18).max(120).required(),
	balance: Joi.number().required(),
	password: Joi.string().regex(/[ A-Za-z0-9_@.#&+-]{14,}/).required(),
});
