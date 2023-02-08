import { Router } from 'express';
import { createUser, deleteUserConnection, getUserById, getUserConnections } from '../controllers/user';
const userRouter = Router();

userRouter.post('/', async (req, res) => {
    const response = await createUser(req.body)
    res.status(response.status).json(response)
});

userRouter.get('/:id', async(req, res)=> {
    const response = await getUserById(req.params.id)
    res.status(response.status).json(response)
})

userRouter.get('/:id/connection/:connectionId', async(req, res)=> {
    const response = await getUserById(req.params.connectionId)
    res.status(response.status).json(response)
})

userRouter.get('/:id/connection', async(req, res)=> {
    const response = await getUserConnections(req.params.id)
    res.status(response.status).json(response)
})

userRouter.delete('/:id/connection', async(req, res)=> {
    const response = await deleteUserConnection(req.params.id, req.query.userToId as string)
    res.status(response.status).json(response)
})

export default userRouter;