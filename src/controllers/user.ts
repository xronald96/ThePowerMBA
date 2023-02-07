import User from '../schemas/User';
import { CreateErrorResponse, CreateSuccessResponse } from '../utils/responses';
import bcrypt from 'bcryptjs';
import { ErrorResponse, SuccessResponse } from '../types/Responses';
import { UserEntity } from '../types/UserEntity';
import { HTTP_STATUS, RESPONSE_ERROR_MESSAGE } from '../utils/constants';

const createUser = async ({
	name,
	surname,
	email,
	password,
	phone,
	birthday,
}: UserEntity): Promise<SuccessResponse | ErrorResponse> => {
	try {
		if (!(email && password && name && surname && phone && birthday))
			return CreateErrorResponse(HTTP_STATUS.BAD_REQUEST, RESPONSE_ERROR_MESSAGE.INPUTS_REQUIRED);

		const user = await User.findOne({ email }).exec();

		if (user) return CreateErrorResponse(HTTP_STATUS.BAD_REQUEST, RESPONSE_ERROR_MESSAGE.USER_ALREADY_EXIST);

		const encryptedPassword = await bcrypt.hash(password, 10);
		const newUser = await new User({ name, surname, email, password: encryptedPassword, phone, birthday });
		newUser.save();
		return CreateSuccessResponse(HTTP_STATUS.CREATED, newUser);
	} catch (err) {
		return CreateErrorResponse(HTTP_STATUS.INTERNAL_ERROR, RESPONSE_ERROR_MESSAGE.INTERNAL_ERROR, err);
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
