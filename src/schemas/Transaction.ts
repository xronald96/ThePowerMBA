import { Schema, model } from 'mongoose';
import { TransactionEntity } from '../types/TransactionEntity';

const transactionSchema = new Schema<TransactionEntity>(
	{
		from: { type: String, required: true },
		to: { type: String, required: true },
		timestamp: { type: Number, required: true },
		amount: { type: Number, required: true },
		tax: { type: Number, required: true },
	},
	{ collection: 'transaction' },
);

export default model<TransactionEntity>('Transaction', transactionSchema);
