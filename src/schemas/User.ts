import { Schema, model } from 'mongoose';
import { UserEntity } from '../types/UserEntity';

const userSchema = new Schema<UserEntity>(
	{
		name: { type: String, required: true },
		surname: { type: String, required: true },
		age: { type: Number, required: true },
		balance: { type: Number, required: true },
		accountNumber: { type: Number, required: true },
		connections: { type: [String], required: false },
		password: { type: String, required: true },
		token: { type: String, required: false },
	},
	{ collection: 'user' },
);

export default model<UserEntity>('User', userSchema);
