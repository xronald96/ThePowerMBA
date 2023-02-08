import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../schemas/User';
import { ErrorResponse, SuccessResponse } from '../types/Responses';
import { HTTP_STATUS, RESPONSE_ERROR_MESSAGE } from '../utils/constants';
import { CreateErrorResponse, CreateSuccessResponse } from '../utils/responses';


export const login = async (req : any): Promise<SuccessResponse | ErrorResponse> => {
	try {
		const {name, password} = req.body;
		if (!(name && password)) return CreateErrorResponse(HTTP_STATUS.BAD_REQUEST, RESPONSE_ERROR_MESSAGE.INPUTS_REQUIRED);

		const user = await User.findOne({ name }).exec();
		if (user && (await bcrypt.compare(password, user.password))) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const token = jwt.sign({ user_id: user._id, name }, process.env.JWT_TOKEN!, {
				expiresIn: '15min',
			});
			user.token = token;
			await user.save();
			req.session.userId= user.id
			return CreateSuccessResponse(HTTP_STATUS.OK, user);
		} else return CreateErrorResponse(HTTP_STATUS.BAD_REQUEST, RESPONSE_ERROR_MESSAGE.INVALID_CREDENTIALS);
	} catch (err) {
		return CreateErrorResponse(HTTP_STATUS.INTERNAL_ERROR, RESPONSE_ERROR_MESSAGE.INTERNAL_ERROR, err);
	}
};
