import request from 'supertest';
import { app } from '../../index';
import { disconnect } from 'mongoose';
import User from '../../schemas/User';
import { HTTP_STATUS } from '../../utils/constants';
import { newUser, realPassword } from '../mocks/userMocks';
import express from 'express';

describe('Transaction route', () => {
	let user1: any;
	let user2: any;
	const parentAPP = express();
	parentAPP.use(function (req: any, _res: any, next: any) {
		// lets stub session middleware
		req.session = {};
		next();
	});
	parentAPP.use(function (req: any, _res: any, next: any) {
		// lets stub session middleware
		req.session.userId = 'sesion';
		next();
	});
	parentAPP.use(app);
	beforeEach(async () => {
		jest.setTimeout(10000);
	});

	beforeAll(async () => {
		await User.deleteMany().exec();

		user1 = await new User(newUser);
		user2 = await new User({
			...newUser,
			name: 'pedro',
		});
		await user1.save();
		await user2.save();
	});

	afterAll(async () => {
		await User.deleteMany().exec();
		await disconnect();
	});

	it('crate new transaction', async () => {
		const result = await request(parentAPP)
			.put('/login')
			.send({ name: user1.name, password: realPassword });
		await request(parentAPP)
			.post('/transaction')
			.send({ from: user1.id, to: user2.id, amount: 20 })
			.set({ 'x-access-token': result.body?.response?.token })
			.expect(HTTP_STATUS.OK)
			.expect('Content-Type', /application\/json/);
	});

	it.each([
		{ from: undefined, to: user2, amount: 2, undefinedValue: 'from' },
		{ from: user2, to: undefined, amount: 3, undefinedValue: 'to' },
		{ from: user2, to: user2, amount: undefined, undefinedValue: 'amount' },
	])('Error when ${undefinedValue} is not provided', async ({ from, to, amount }) => {
		const result = await request(parentAPP)
			.put('/login')
			.send({ name: user1.name, password: realPassword });
		await request(parentAPP)
			.post('/transaction')
			.send({ from, to, amount })
			.set({ 'x-access-token': result.body?.response?.token })
			.expect(HTTP_STATUS.BAD_REQUEST);
	});

	it('Error when from or to user is not found in the DB', async () => {
		const result = await request(parentAPP)
			.put('/login')
			.send({ name: user1.name, password: realPassword });
		await request(parentAPP)
			.post('/transaction')
			.send({ from: user1.id, to: '41224d776a326fb40f000001', amount: 10 })
			.set({ 'x-access-token': result.body?.response?.token })
			.expect(HTTP_STATUS.NOT_FOUND);
	});

	it('Error when amount is bigger than balance', async () => {
		const result = await request(parentAPP)
			.put('/login')
			.send({ name: user1.name, password: realPassword });
		await request(parentAPP)
			.post('/transaction')
			.send({ from: user1.id, to: user2.id, amount: 1000 })
			.set({ 'x-access-token': result.body?.response?.token })
			.expect(HTTP_STATUS.BAD_REQUEST);
	});

	// it('after 1000 transactions the nextOne is cheaper')
});
