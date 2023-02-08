export interface UserEntity {
	_id: string,
	name: string;
	surname: string;
	age: number;
	balance: number;
	connections: Array<string>,
	accountNumber: number;
	password: string;
	token: string;
}