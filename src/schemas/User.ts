import { Schema, model } from 'mongoose';
import { UserEntity } from '../types/UserEntity';

const userSchema = new Schema<UserEntity>(
	{
		name: { type: String, required: true },
		surname: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		token: { type: String, required: false },
	},
	{ collection: 'user' },
);

export default model<UserEntity>('User', userSchema);
