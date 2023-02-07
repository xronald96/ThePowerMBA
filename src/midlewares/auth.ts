import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
	const token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (!token) {
		return res.status(403).send('A token is required for authentication');
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_TOKEN);
		req.user = decoded;
	} catch (err) {
		return res.status(401).send('Invalid Token');
	}
	return next();
};

