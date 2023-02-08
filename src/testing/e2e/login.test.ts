import request from 'supertest';
import { app } from '../../index';
import { disconnect } from 'mongoose';
import { newUser } from '../mocks/userMocks';
import User from '../../schemas/User';
import { HTTP_STATUS, RESPONSE_ERROR_MESSAGE } from '../../utils/constants';

describe('Login route', () => {
	beforeEach(async () => {
		jest.setTimeout(10000);
	});

	beforeAll(async () => {
		await User.deleteMany().exec();
	});

	afterAll(async () => {
		await User.deleteMany().exec();
		await disconnect();
	});

	it('login new user', async () => {
		await request(app).post('/user').send(newUser);
		await request(app)
			.put('/login')
			.send({ name: newUser.name, password: newUser.password })
			.expect(HTTP_STATUS.OK)
			.expect('Content-Type', /application\/json/);
	});

	it('login with invalid credencials', async () => {
		const result = await request(app).put('/login').send({ name: 'wrong email', password: 'wrong password' });
		expect(result.status).toBe(HTTP_STATUS.BAD_REQUEST);
		expect(result.body.error.message).toBe(RESPONSE_ERROR_MESSAGE.INVALID_CREDENTIALS);
	});
});
