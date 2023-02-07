import { connect } from 'mongoose';

export const initDb = async () => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const uri_mongo = process.env.URI_MONGODB_PROD!;
		await connect(uri_mongo);
		// eslint-disable-next-line no-console
		console.log('Database connected');
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Database connetion error: ', error);
	}
};
