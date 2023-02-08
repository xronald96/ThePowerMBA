import Connection from '../schemas/Connection';
import Request from '../schemas/Connection';
import User from '../schemas/User';
import { HTTP_STATUS, RESPONSE_ERROR_MESSAGE } from '../utils/constants';
import { CreateErrorResponse, CreateSuccessResponse } from '../utils/responses';

const sendConnection = async ({
	from,
	to,
	accountNumber,
}: {
	from: string;
	to: string;
	accountNumber: number;
}) => {
	try {
		const fromUser = await User.findById(from).exec();
		const toUser = await User.findOne({
			$or: [{ _id: to }, { accountNumber: accountNumber }],
		}).exec();
		if (!fromUser || !toUser)
			return CreateErrorResponse(HTTP_STATUS.BAD_REQUEST, 'This user not exist');
		const previousRequest = await Request.findOne({
			from: fromUser.id,
			to: toUser.id,
		});
		if (previousRequest)
			return CreateErrorResponse(HTTP_STATUS.BAD_REQUEST, 'This request have already sent ');
		const newRequest = new Connection({
			from: fromUser.id,
			to: toUser.id,
			status: 'pending',
		});
		newRequest.save();
		return CreateSuccessResponse(HTTP_STATUS.CREATED, newRequest);
	} catch (err) {
		return CreateErrorResponse(
			HTTP_STATUS.INTERNAL_ERROR,
			RESPONSE_ERROR_MESSAGE.INTERNAL_ERROR,
			err,
		);
	}
};

const manageConnection = async ({
	connectionId,
	response,
}: {
	connectionId: string;
	response: boolean;
}) => {
	try {
		if (!connectionId || !response)
			return CreateErrorResponse(HTTP_STATUS.BAD_REQUEST, 'connection id is required');
		const connection = await Connection.findById(connectionId);
		if (!connection)
			return CreateErrorResponse(HTTP_STATUS.NOT_FOUND, 'This connection not exist');

		connection.status = response ? 'accepted' : 'declined';
		connection.save();
		const userTo = await User.findById(connection.to);
		const userFrom = await User.findById(connection.from);
		if (userFrom && userTo) {
			if (
				userFrom.connections.find((userId) => userId === userTo.id) ||
				userTo.connections.find((userId) => userId === userFrom.id)
			)
				return CreateErrorResponse(
					HTTP_STATUS.BAD_REQUEST,
					'This connection have alreadt been added',
				);
			userTo.connections = userTo.connections
				? [...userTo.connections, connection.from]
				: [connection.from];
			userFrom.connections = userFrom.connections
				? [...userFrom.connections, connection.to]
				: [connection.to];
			userFrom.save();
			userTo.save();
			return CreateSuccessResponse(HTTP_STATUS.OK, connection);
		} else {
			return CreateErrorResponse(HTTP_STATUS.NOT_FOUND, 'Users not found');
		}
	} catch (err) {
		return CreateErrorResponse(
			HTTP_STATUS.INTERNAL_ERROR,
			RESPONSE_ERROR_MESSAGE.INTERNAL_ERROR,
			err,
		);
	}
};

export { sendConnection, manageConnection };
