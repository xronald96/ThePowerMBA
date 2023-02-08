import express from 'express';
import { headers } from './headers';
import dotenv from 'dotenv';
import routes from './routes/index';
import { initDb } from './database/database';
import sessions from 'express-session';

dotenv.config();
initDb();
const app = express();
const PORT = 8002;
app.use(express.json());
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
	sessions({
		secret: process.env.JWT_TOKEN!,
		saveUninitialized: true,
		cookie: { maxAge: oneDay },
		resave: false,
	}),
);
app.all('/*', headers);

app.use(routes);
process.env.NODE_ENV !== 'dev' &&
	app.listen(PORT, () => {
		// eslint-disable-next-line no-console
		console.log('Running on port: ', PORT);
	});

export { app };
