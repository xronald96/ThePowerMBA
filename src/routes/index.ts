import { Router } from 'express';
import { verifyToken } from '../midlewares/auth';
import { sessionChecker } from '../midlewares/session';
import connectionRouter from './connection';
import loginRouter from './login';
import userRouter from './user';
const routes = Router();

routes.use(sessionChecker)
routes.use(verifyToken)
routes.use('/login', loginRouter);
routes.use('/user', userRouter);
routes.use('/connection', connectionRouter);
export default routes;
