import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { StatusCodes } from 'http-status-codes';
import { CronJob } from 'cron';

import { STATUS_ERROR, STATUS_SUCCESS } from './common/constant';

import router from './routes/index';
import { expireCardsWhenDue, resetSpendLimitAndRemainingSpendWhenDue } from './services/card/card.service';
import Logger from './config/logger';

dotenv.config();

require('./config/env.validation');

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', router);

/**
 * Update card status to expired when expiry_date is due
 *
 * Cron runs for 12:00 am
 */
const job = new CronJob(
  '0 0 * * *',
  async () => {
    Logger.info('cron job running.....')
    expireCardsWhenDue();
    resetSpendLimitAndRemainingSpendWhenDue();
  },
  null,
  true,
  'Europe/Brussels',
);

job.start();

app.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: STATUS_SUCCESS,
    message: 'Welcome to qred app 👈👈',
  });
});

app.all('*', (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: STATUS_ERROR,
    message: 'resource not found',
  });
});

app.use((error: Record<string | number, any>, req: Request, res: Response) => {
  error.status = error.status || 'error';
  error.statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
});

export default app;
