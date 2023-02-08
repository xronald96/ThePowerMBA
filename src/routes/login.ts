import { Router } from 'express';
import { login } from '../controllers/login'
const loginRouter = Router();

loginRouter.put('', async (req: any, res) => {
	const response = await login(req);
	res.status(response.status).json(response)
});

export default loginRouter;
