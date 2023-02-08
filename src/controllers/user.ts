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
		if (!id) return CreateErrorResponse(HTTP_STATUS.BAD_REQUEST, 'id is required');
		const user = await User.findById(id).exec();
		return CreateSuccessResponse(200, {
			name: user?.name,
			age: user?.age,
			accountNumber: user?.accountNumber,
		});
	} catch (err) {
		return CreateErrorResponse(500, 'Internal Error', err);
	}
};

const getUserConnections = async (id: string) => {
	try {
		if (!id) return CreateErrorResponse(HTTP_STATUS.BAD_REQUEST, 'id is required');
		const user = await User.findById(id).exec();
		const connections =
			user && user.connections.length > 0
				? await User.find({ _id: [user?.connections] })
				: [];
		return CreateSuccessResponse(
			HTTP_STATUS.OK,
			connections?.map((itemUser) => {
				return {
					name: itemUser.name,
					age: itemUser.age,
					accountNumber: itemUser.accountNumber,
				};
			}),
		);
	} catch (err) {
		return CreateErrorResponse(500, 'Internal Error', err);
	}
};

const deleteUserConnection = async (id: string, userToId: string) => {
	if (!id || !userToId) return CreateErrorResponse(HTTP_STATUS.BAD_REQUEST, 'id is required');
	const userFrom = await User.findById(id);
	const userTo = await User.findById(userToId);
	if (userFrom && userTo) {
		userTo.connections = userTo?.connections.filter((it) => it !== id);
		userFrom.connections = userFrom?.connections.filter((it) => it !== userToId);
		userTo.save();
		userFrom.save();
		return CreateSuccessResponse(HTTP_STATUS.OK, null);
	} else return CreateErrorResponse(HTTP_STATUS.NOT_FOUND, 'Users not found');
};

export { createUser, getUserById, getUserConnections, deleteUserConnection };
