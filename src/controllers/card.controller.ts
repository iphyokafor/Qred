import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DEFAULT_PIN, STATUS_ERROR, STATUS_SUCCESS } from '../common/constant';
import { PageDtoConfig } from '../common/interface';
import {
  calculateExpiryYear,
  genarateCardCvv,
  genarateMasterCardNumber,
  genarateVisaCardNumber,
  hashPin,
} from '../common/utils/helper';
import Logger from '../config/logger';
import { CardType } from '../models/card.model';
import {
  activateCard,
  createCard,
  findCardById,
  getActiveCardsPaginatedAndSearch,
  getPendingCardsPaginatedAndSearch,
  setCardSpendingLimit,
  updateCardPin,
} from '../services/card/card.service';
import { setSpendingLimitConfig } from '../services/card/types';
import { getCompany } from '../services/company/company.service';

export const addCardHandler = async (req: Request, res: Response) => {
  const { card_type, company, account } = req.body;

  try {
    const hashedPin = await hashPin(DEFAULT_PIN);

    const card = await createCard({
      card_number:
        card_type === CardType.MASTER
          ? genarateMasterCardNumber()
          : card_type === CardType.VISA
          ? genarateVisaCardNumber()
          : genarateMasterCardNumber(),
      expiry_date: calculateExpiryYear(new Date()),
      cvv: genarateCardCvv(),
      pin: hashedPin,
      card_type,
      company,
      account,
    });

    return res.status(StatusCodes.CREATED).send({
      status: STATUS_SUCCESS,
      message: 'Card added successfully',
      data: card,
    });

  } catch (error) {
    Logger.error('addCardHandler failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error adding card',
      data: null,
    });
  }
};
export const fetchActivatedCardsHandler = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const { search, page, limit } = req.query;

  const query = { search, page, limit } as unknown as PageDtoConfig;

  try {
    const company = await getCompany(companyId);

    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: STATUS_ERROR,
        message: 'Invalid company id',
        data: null,
      });
    }

    const cards = await getActiveCardsPaginatedAndSearch(companyId, query);

    if (!cards) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: STATUS_ERROR,
        message: 'No cards found',
        data: null,
      });
    }

    return res.status(StatusCodes.OK).send({
      status: STATUS_SUCCESS,
      message: 'cards fetched successfully',
      data: cards,
    });

  } catch (error) {
    Logger.error('fetchActivatedCardsHandler failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error fetching cards',
      data: null,
    });
  }
};
export const fetchPendingCardsHandler = async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const { search, page, limit } = req.query;

  const query = { search, page, limit } as unknown as PageDtoConfig;

  try {
    const company = await getCompany(companyId);

    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: STATUS_ERROR,
        message: 'Invalid company id',
        data: null,
      });
    }

    const cards = await getPendingCardsPaginatedAndSearch(companyId, query);

    if (!cards) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: STATUS_ERROR,
        message: 'No cards found',
        data: null,
      });
    }

    return res.status(StatusCodes.OK).send({
      status: STATUS_SUCCESS,
      message: 'cards fetched successfully',
      data: cards,
    });

  } catch (error) {
    Logger.error('fetchInActivateCardHandler failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error fetching cards',
      data: null,
    });
  }
};
export const fetchCardHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const card = await findCardById(id);

    if (!card) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: STATUS_ERROR,
        message: 'No card found',
        data: null,
      });
    }

    return res.status(StatusCodes.OK).send({
      status: STATUS_SUCCESS,
      message: 'Card fetched successfully',
      data: card,
    });

  } catch (error) {
    Logger.error('fetchcardHandler failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error fetching card',
      data: null,
    });
  }
};
export const activateCardHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const card = await activateCard(id);

    if (!card) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: STATUS_ERROR,
        message: 'No card found',
        data: null,
      });
    }

    return res.status(StatusCodes.OK).send({
      status: STATUS_SUCCESS,
      message: 'Card activated successfully',
      data: card,
    });

  } catch (error) {
    Logger.error('activateCardHandler failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error activating card',
      data: null,
    });
  }
};
export const updateCardPinHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { pin } = req.body;

  try {

    const hashedPin = await hashPin(pin);
    const card = await updateCardPin(id, hashedPin);

    if (!card) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: STATUS_ERROR,
        message: 'No card found',
        data: null,
      });
    }

    return res.status(StatusCodes.OK).send({
      status: STATUS_SUCCESS,
      message: 'Pin updated successfully',
      data: card,
    });

  } catch (error) {
    Logger.error('updateCardPinHandler failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error updating card pin card',
      data: null,
    });
  }
};
export const createSpendingLimitHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { spending_limit, spending_limit_interval } = req.body;
  const payload: setSpendingLimitConfig = { spending_limit, spending_limit_interval };

  try {
    const spendLimit = await setCardSpendingLimit(id, payload);

    if (!spendLimit) {
      return res.status(StatusCodes.NOT_FOUND).send({
        status: STATUS_ERROR,
        message: 'Can only set limit on activated card',
        data: null,
      });
    }
    return res.status(StatusCodes.CREATED).send({
      status: STATUS_SUCCESS,
      message: 'Spending limit set successfully',
      data: spendLimit,
    });
    
  } catch (error) {
    Logger.error('createSpendingLimitHandler failed', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: STATUS_ERROR,
      message: 'Error setting spend limit',
      data: null,
    });
  }
};
