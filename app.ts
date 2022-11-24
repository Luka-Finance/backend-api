import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/configSetup';
import { isAuthorized } from './helpers/middlewares';
import cron from 'node-cron';

// routes
import routes from './routes';
import adminRoutes from './routes/admin';
import { Cron } from './services/crons';

const app: Application = express();

app.use(morgan('dev'));

// PARSE JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ENABLE CORS AND START SERVER
app.use(cors({ origin: true }));
app.listen(config.PORT, () => {
	console.log(`Server started on port ${config.PORT}`);
});

// Routes
app.all('*', isAuthorized);
app.use(routes);
app.use('/admin', adminRoutes);

// cron.schedule('* * * * *', () => {
// 	// 0 18 * * *
// 	console.log('running a task every day by 6pm');
// 	new Cron().creditDailyInterest();
// });

// cron.schedule('10 * * * *', () => {
// 	// 59 23 * * *
// 	console.log('running a task every day by 11:59pm');
// 	new Cron().resetInterest();
// });

module.exports = app;
