import User from '../../schemas/User';
import { encrypPassword } from '../../utils/password';
import { populateInitDB } from '../mocks/userMocks';

export const populateDb = () => {
	populateInitDB.forEach(async (item) => {
		const newUser = new User({ ...item, password: await encrypPassword(item.password)});
        await newUser.save();
	});
};
