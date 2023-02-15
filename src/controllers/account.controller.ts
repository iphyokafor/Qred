import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { STATUS_ERROR, STATUS_SUCCESS } from '../common/constant';
import { genarateAccountNumber } from '../common/utils/helper';
import Logger from '../config/logger';
import { createAccount, getAccount } from '../services/account/account.service';

export const fetchAccountHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const account = await getAccount(id);

    if (!account) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: STATUS_ERROR,
        message: 'No account found',
        data: null,
      });
    }

    return res.status(StatusCodes.OK).send({
      status: STATUS_SUCCESS,
      message: 'Account fetched successfully',
      data: account,
    });

  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error fetching account',
      data: null,
    });
  }
};

export const addAccountHandler = async (req: Request, res: Response) => {
  const { company } = req.body;

  try {
    const accountNumber = await genarateAccountNumber();

    const account = await createAccount({ account_number: accountNumber, company });

    return res.status(StatusCodes.CREATED).send({
      status: STATUS_SUCCESS,
      message: 'Account created successfully',
      data: account,
    });
    
  } catch (error) {
    Logger.error('createAccountHandler failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error creating account',
      data: null,
    });
  }
};
