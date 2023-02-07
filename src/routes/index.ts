import { Router } from 'express';
import loginRouter from './login';
import trainerRouter from './trainer';
import userRouter from './user';
const routes = Router();

routes.use('/login', loginRouter);
routes.use('/user', userRouter);
routes.use('/trainer', trainerRouter);
export default routes;
