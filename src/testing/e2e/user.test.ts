import request from 'supertest';
import { app } from '../../index';
import { disconnect } from 'mongoose';
import { newUser } from '../mocks/userMocks';
import User from '../../schemas/User';
import { HTTP_STATUS } from '../../utils/constants';
describe('User route', () => {
	let idUser = '';
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

	it('create new user', async () => {
		const result = await request(app).post('/user/').send({
			name: 'juan',
			surname: 'Veliz',
			age: 26,
			balance: 100,
			password: '163Rewr3333@s3333333',
		});
		expect(result.status).toEqual(HTTP_STATUS.CREATED);
		idUser = result.body?.response?._id;
		expect(await User.findById(idUser).exec()).toBeDefined();
	});

	it('error when create user with a email registered', async () => {
		const result = await request(app).post('/user').send(newUser);
		expect(result.status).toEqual(HTTP_STATUS.BAD_REQUEST);
		idUser = result.body?.response?._id;
		expect(await User.findById(idUser).exec()).toBeDefined();
	});
});
