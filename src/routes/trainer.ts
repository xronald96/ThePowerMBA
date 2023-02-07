import { Router } from 'express';
import { getTrainers } from '../controllers/trainer';
const trainerRouter = Router();

trainerRouter.get('/', async (_req, res) => {
	const response = await getTrainers();
	res.status(response.status).json(response);
});

export default trainerRouter;
