import Transaction from '../schemas/Transaction';
import User from '../schemas/User';
import { HTTP_STATUS, RESPONSE_ERROR_MESSAGE } from '../utils/constants';
import { CreateErrorResponse, CreateSuccessResponse } from '../utils/responses';

const createTransaction = async ({
	from,
	to,
	amount,
}: {
	from: string;
	to: string;
	amount: number;
}) => {
	try {
		if (!from || !to || !amount)
			return CreateErrorResponse(HTTP_STATUS.BAD_REQUEST, 'from to and amount are required');
		const userTo = await User.findById(to);
		const userFrom = await User.findById(from);
		if (!userFrom || !userTo)
			return CreateErrorResponse(HTTP_STATUS.NOT_FOUND, 'Users not found');
		const transactions = await Transaction.find({ from: from });
		const tax = transactions.length < 1000 ? amount * 1.01 : amount * 1.005;
		if (amount + tax > userFrom.balance)
			return CreateErrorResponse(HTTP_STATUS.BAD_REQUEST, 'insufficient balance');
		const timestamp = new Date().getTime();
		const newTransaction = new Transaction({ from, to, amount, timestamp, tax });
		await newTransaction.save();
		userFrom.balance = userFrom.balance - (amount + tax);
		userTo.balance = userTo.balance + amount;
		userFrom.save();
		userTo.save();
		return CreateSuccessResponse(HTTP_STATUS.OK, newTransaction);
	} catch (err) {
		return CreateErrorResponse(
			HTTP_STATUS.INTERNAL_ERROR,
			RESPONSE_ERROR_MESSAGE.INTERNAL_ERROR,
			err,
		);
	}
};

const getTransactions = async (userId: string) => {
	if (!userId) return CreateErrorResponse(HTTP_STATUS.BAD_REQUEST, 'userId required');
	const transactions = await Transaction.find({ $or: [{ from: userId }, { to: userId }] });
	return CreateSuccessResponse(
		HTTP_STATUS.OK,
		transactions.map((transaction) => {
			return {
				type: transaction.from === userId ? 'Send' : 'Recieve',
				amount: transaction.amount,
				date: new Date(transaction.timestamp).toString(),
			};
		}),
	);
};


export { createTransaction, getTransactions };
