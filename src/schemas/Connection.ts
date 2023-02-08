import { Schema, model } from 'mongoose';
import { ConneionEntity } from '../types/ConnetionEntity';

const connectionsSchema = new Schema<ConneionEntity>(
	{
		from: { type: String, required: true },
		to: { type: String, required: true },
		status: { type: String, required: true },
		
	},
	{ collection: 'request' },
);

export default model<ConneionEntity>('Request', connectionsSchema);
