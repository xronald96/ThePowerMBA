import { HTTP_STATUS } from '../utils/constants';
import { CreateErrorResponse } from '../utils/responses';
import { skipRoute } from '../utils/skipper';

export const sessionChecker = (req: any, res: any, next: any) => {
	if (skipRoute(req)) return next();
	if (req.session.userId) {
		next();
	} else {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json(CreateErrorResponse(HTTP_STATUS.BAD_REQUEST, 'Have to do login'));
	}
};
