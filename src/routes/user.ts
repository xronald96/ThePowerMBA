import { Router } from 'express';
import { createUser, getUserById } from '../controllers/user';
const userRouter = Router();

userRouter.post('/', async (req, res) => {
    const response = await createUser(req.body)
    res.status(response.status).json(response)
});

userRouter.get('/:id', async(req, res)=> {
    const response = await getUserById(req.params.id)
    res.status(response.status).json(response)
})
export default userRouter;