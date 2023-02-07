import bcrypt from 'bcryptjs';

export const encrypPassword = async (password: string) => {
	return await bcrypt.hash(password, 10);
};
