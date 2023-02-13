import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DEFAULT_PIN, STATUS_ERROR, STATUS_SUCCESS } from '../common/constant';
import { PageDtoConfig } from '../common/interface';
import {
  calculateExpiryYear,
  genarateAccountNumber,
  genarateCardCvv,
  genarateMasterCardNumber,
  hashPin,
} from '../common/utils/helper';
import Logger from '../config/logger';
import { CardType } from '../models/card.model';
import { Status, Type } from '../models/transaction.model';
import { createAccount } from '../services/account/account.service';
import { createCard } from '../services/card/card.service';
import {
  companyExists,
  createCompany,
  getCompaniesPaginatedAndSearch,
  getCompany,
  deactivateCompany,
  updateCompany,
} from '../services/company/company.service';
import { createCompanyConfig, updateCompanyConfig } from '../services/company/types';
import { createTransaction } from '../services/transaction/transaction.service';
export const createCompanyHandler = async (req: Request, res: Response) => {
  const { name, address, year_founded } = req.body;
  const payload: createCompanyConfig = { name, address, year_founded };

  try {
    const checkCompanyExist = await companyExists(name);

    if (checkCompanyExist) {
      return res.status(StatusCodes.CONFLICT).send({
        status: STATUS_ERROR,
        message: 'Company name already in use',
        data: null,
      });
    }

    const company = await createCompany(payload);
    const hashedPin = await hashPin(DEFAULT_PIN);
    // create card with default pin, cardType = master, card_number
    const card = await createCard({
      card_number: genarateMasterCardNumber(),
      expiry_date: calculateExpiryYear(company?.createdAt),
      cvv: genarateCardCvv(),
      pin: hashedPin,
      card_type: CardType.MASTER,
      company: company?.id,
    });
    // create an aacount with a default main balance = 20k
   const account = await createAccount({
      balance: 20000,
      account_number: genarateAccountNumber(),
      company: company?.id,
      card: card?.id,
    });

    await createTransaction({
      amount: account?.balance,
      type: Type.CREDIT,
      status: Status.SUCCESS,
      card: card?.id,
      account: account?.id
    })
    // explain flow
    // company will add money to his account => main balance = 20k using account number

    return res.status(StatusCodes.CREATED).send({
      status: STATUS_SUCCESS,
      message: 'Company created successfully',
      data: company,
    });
  } catch (error) {
    Logger.error('createCompanyHandler failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error creating company',
      data: null,
    });
  }
};

export const fetchCompaniesHandler = async (req: Request, res: Response) => {
  const { search, page, limit } = req.query;

  const query = { search, page, limit } as unknown as PageDtoConfig;

  try {
    const companies = await getCompaniesPaginatedAndSearch(query);

    if (!companies) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: STATUS_ERROR,
        message: 'No companies found',
        data: null,
      });
    }

    return res.status(StatusCodes.OK).send({
      status: STATUS_SUCCESS,
      message: 'Companies fetched successfully',
      data: companies,
    });
  } catch (error) {
    Logger.error('fetchCompaniesHandler failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error fetching companies',
      data: null,
    });
  }
};

export const fetchCompanyHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const company = await getCompany(id);

    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: STATUS_ERROR,
        message: 'No company found',
        data: null,
      });
    }

    return res.status(StatusCodes.OK).send({
      status: STATUS_SUCCESS,
      message: 'Company fetched successfully',
      data: company,
    });
  } catch (error) {
    Logger.error('fetchCompanyHandler failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error fetching company',
      data: null,
    });
  }
};

export const updateCompanyHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { name, address, year_founded } = req.body;

  const payload = {
    id,
    name,
    address,
    year_founded,
  } as updateCompanyConfig;

  try {
    const checkCompanyExist = await companyExists(name);

    const company = await updateCompany(payload);

    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: STATUS_ERROR,
        message: 'No company found',
        data: null,
      });
    }

    if (checkCompanyExist) {
      return res.status(StatusCodes.CONFLICT).send({
        status: STATUS_ERROR,
        message: 'This name is already in use by another company',
        data: null,
      });
    }

    return res.status(StatusCodes.OK).send({
      status: STATUS_SUCCESS,
      message: 'Company updated successfully',
      data: company,
    });
  } catch (error) {
    Logger.error('updateCompanyHandler failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error updating company',
      data: null,
    });
  }
};

export const deactivateCompanyHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const company = await deactivateCompany(id);

    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: STATUS_ERROR,
        message: 'Company not found',
        data: company,
      });
    }

    return res.status(StatusCodes.OK).send({
      status: STATUS_SUCCESS,
      message: 'Company deleted successfully',
      data: company,
    });
  } catch (error) {
    Logger.error('deactivateCompanyHandler failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error deleting company',
      data: null,
    });
  }
};
