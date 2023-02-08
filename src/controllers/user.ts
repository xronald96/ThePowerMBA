import Joi from 'joi';
import User from '../schemas/User';
import { CreateErrorResponse, CreateSuccessResponse } from '../utils/responses';
import bcrypt from 'bcryptjs';
import { ErrorResponse, SuccessResponse } from '../types/Responses';
import { UserEntity } from '../types/UserEntity';
import { HTTP_STATUS, RESPONSE_ERROR_MESSAGE } from '../utils/constants';
import { createUserSchema } from '../schemas/Joi/createUser';
const createUser = async ({
	name,
	surname,
	age,
	balance,
	password,
}: UserEntity): Promise<SuccessResponse | ErrorResponse> => {
	try {
		try {
			Joi.assert(
				{
					name,
					surname,
					age,
					balance,
					password,
				},
				createUserSchema,
			);
		} catch (err) {
			return CreateErrorResponse(
				HTTP_STATUS.BAD_REQUEST,
				RESPONSE_ERROR_MESSAGE.INPUTS_REQUIRED,
				err,
			);
		}
		const nameToLowerCase = name.toLocaleLowerCase();
		const user = await User.findOne({ name: nameToLowerCase }).exec();

		if (user)
			return CreateErrorResponse(
				HTTP_STATUS.BAD_REQUEST,
				RESPONSE_ERROR_MESSAGE.USER_ALREADY_EXIST,
			);
		const accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
		const encryptedPassword = await bcrypt.hash(password, 10);
		const newUser = await new User({
			name: nameToLowerCase,
			surname,
			age,
			password: encryptedPassword,
			accountNumber,
			balance,
		});
		newUser.save();
		return CreateSuccessResponse(HTTP_STATUS.CREATED, newUser);
	} catch (err) {
		return CreateErrorResponse(
			HTTP_STATUS.INTERNAL_ERROR,
			RESPONSE_ERROR_MESSAGE.INTERNAL_ERROR,
			err,
		);
	}
};

const getUserById = async (id: string) => {
	try {
		const user = await User.findById(id).exec();
		return CreateSuccessResponse(200, user);
	} catch (err) {
		return CreateErrorResponse(500, 'Internal Error', err);
	}
};

export { createUser, getUserById };
