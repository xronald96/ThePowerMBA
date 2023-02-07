import { Schema, model } from 'mongoose';
import { TrainerEntity } from '../types/TrainerEntity';

const trainerSchema = new Schema<TrainerEntity>(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		labels: [ Schema.Types.String ],
	},
	{ collection: 'trainer' },
);

export default model<TrainerEntity>('Trainer', trainerSchema);
