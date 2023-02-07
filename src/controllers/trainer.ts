import Trainer from '../schemas/Trainer';
import { ErrorResponse, SuccessResponse } from '../types/Responses';
import { HTTP_STATUS, RESPONSE_ERROR_MESSAGE } from '../utils/constants';
import { CreateErrorResponse, CreateSuccessResponse } from '../utils/responses';

export const getTrainers = async (): Promise<SuccessResponse | ErrorResponse> => {
	try {
		return CreateSuccessResponse(HTTP_STATUS.OK, await Trainer.find({}).exec());
	} catch (err) {
		return CreateErrorResponse(HTTP_STATUS.INTERNAL_ERROR, RESPONSE_ERROR_MESSAGE.INTERNAL_ERROR, err);
	}
};
