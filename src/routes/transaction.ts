import { Router } from 'express'
import { createTransaction, getTransactions } from '../controllers/transaction';
const transactionRouter = Router();

transactionRouter.post('/', async(req, res)=> {
    const response = await createTransaction(req.body);
    res.status(response.status).json(response)
})

transactionRouter.get('/', async(req, res)=> {
    const response = await getTransactions(req.body);
    res.status(response.status).json(response)
})

export default transactionRouter;