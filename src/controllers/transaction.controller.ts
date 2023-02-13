import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { STATUS_ERROR, STATUS_SUCCESS } from '../common/constant';
import { PageDtoConfig } from '../common/interface';
import Logger from '../config/logger';
import { getTransactionPaginatedAndSearch, transferFund } from '../services/transaction/transaction.service';
import { transferFundConfig } from '../services/transaction/types';

export const transferFundHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { account_number, amount, narration } = req.body;
  const payload = {account_number, amount, narration } as transferFundConfig;
  
  try {
    const result = await transferFund(id, payload);

    return res.status(StatusCodes.OK).send({
      status: STATUS_SUCCESS,
      message: 'transfered successfully',
      data: result,
    });
  } catch (error) {
    Logger.error('transferFundHandler failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error transafering funds',
      data: null,
    });
  }
};
export const fetchTransactionsHandler = async (req: Request, res: Response) => {
  const { search, page, limit } = req.query;

  const query = { search, page, limit } as unknown as PageDtoConfig;

  try {
    const transactions = await getTransactionPaginatedAndSearch(query);

    if (!transactions) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: STATUS_ERROR,
        message: 'No transactions found',
        data: null,
      });
    }

    return res.status(StatusCodes.OK).send({
      status: STATUS_SUCCESS,
      message: 'transactions fetched successfully',
      data: transactions,
    });
  } catch (error) {
    Logger.error('fetchTransactionsHandler failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error fetching transactions',
      data: null,
    });
  }
};
