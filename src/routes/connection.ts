import { Router } from 'express';
import { manageConnection, sendConnection } from '../controllers/connetion'
const connectionRouter = Router();

connectionRouter.post('/connection', async(req, res)=> {
    const response = await sendConnection(req.body);
    res.status(response.status).json(response)
})

connectionRouter.put('/connection', async(req, res)=> {
    const response = await manageConnection(req.body);
    res.status(response.status).json(response)
})

export default connectionRouter;