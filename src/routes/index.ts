import { Router } from 'express';
import loginRouter from './login';
import userRouter from './user';
const routes = Router();

routes.use('/login', loginRouter);
routes.use('/user', userRouter);
export default routes;
