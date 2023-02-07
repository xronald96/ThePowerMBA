import request from 'supertest';
import { app } from '../../index';
import { disconnect } from 'mongoose';
import { HTTP_STATUS } from '../../utils/constants';
describe('Trainer route', () => {
	beforeEach(async () => {
		jest.setTimeout(10000);
	});

	afterAll(async () => {
		await disconnect();
	});

	it('get all trainers', async () => {
		const result = await request(app).get(`/trainer`);
		expect(result.status).toEqual(HTTP_STATUS.OK);
		expect(result.body.response).toBeDefined();
	});
});
