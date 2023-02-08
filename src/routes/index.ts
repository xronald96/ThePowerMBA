import { Router } from 'express';
import { verifyToken } from '../midlewares/auth';
import { sessionChecker } from '../midlewares/session';
import connectionRouter from './connection';
import loginRouter from './login';
import transactionRouter from './transaction';
import userRouter from './user';
const routes = Router();

routes.use(sessionChecker)
routes.use(verifyToken)
routes.use('/login', loginRouter);
routes.use('/user', userRouter);
routes.use('/connection', connectionRouter);
routes.use('/transaction', transactionRouter);
export default routes;
