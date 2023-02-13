import { PageDtoConfig } from '../../common/interface';
import logger from '../../config/logger';
import cardModel, { Card, CardStatus } from '../../models/card.model';
import { setSpendingLimitConfig } from './types';
import { getSpendingLimitDuration } from '../../common/utils/helper';
import { getCompany } from '../company/company.service';

export const createCard = async (input: Partial<Card>) => {
  try {
    const card = await cardModel.create({
      ...input,
    });

    return card;
  } catch (error) {
    logger.error('createCard failed', error);
    throw error;
  }
};

export const getActiveCardsPaginatedAndSearch = async (companyId: string, props: PageDtoConfig) => {
  let { search, page, limit } = props;

  try {
    page = !page || isNaN(page) ? 1 : Number(page);

    const searchQueries = {
      $or: [{ card_type: { $regex: search, $options: 'ig' } }],
    };

    page = page < 1 ? 1 : Number(page);

    limit = !limit || isNaN(limit) ? 5 : Number(limit);

    let query = search ? searchQueries : {};
    
    const count = await cardModel.countDocuments({ query, status: CardStatus.ACTIVATED });

    let totalPages = Math.ceil(count / limit);
    page = page > totalPages ? totalPages : page;

    const cards = await cardModel
      .find({ query, status: CardStatus.ACTIVATED, company: companyId })
      .populate('company')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    return {
      cards,
      meta: {
        totalPages: totalPages,
        currentPage: page,
        totalCompanies: count,
      },
    };
  } catch (error) {
    logger.error('Unable to fetch companies at this time', error);
    throw error;
  }
};

export const getPendingCardsPaginatedAndSearch = async (companyId: string, props: PageDtoConfig) => {
  let { search, page, limit } = props;

  try {
    page = !page || isNaN(page) ? 1 : Number(page);

    const searchQueries = {
      $or: [{ card_type: { $regex: search, $options: 'ig' } }],
    };

    page = page < 1 ? 1 : Number(page);

    limit = !limit || isNaN(limit) ? 5 : Number(limit);

    let query = search ? searchQueries : {};

    const count = await cardModel.countDocuments({ query, status: CardStatus.PENDING });

    let totalPages = Math.ceil(count / limit);
    page = page > totalPages ? totalPages : page;

    const cards = await cardModel
      .find({ query, status: CardStatus.PENDING, company: companyId })
      .populate('company')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    return {
      cards,
      meta: {
        totalPages: totalPages,
        currentPage: page,
        totalCompanies: count,
      },
    };
  } catch (error) {
    logger.error('Unable to fetch companies at this time', error);
    throw error;
  }
};

export const findCardById = async (id: string) => {
  try {
    const card = await cardModel.findById(id);

    return card;
  } catch (error) {
    throw error;
  }
};

export const activateCard = async (id: string) => {
  try {
    const foundCard = await cardModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        status: CardStatus.ACTIVATED,
      },
      {
        new: true,
      },
    );
    return foundCard;
  } catch (error: any) {
    throw error;
  }
};
export const updateCardPin = async (id: string, pin: string) => {
  try {
    const card = await cardModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        pin: pin,
      },
      {
        new: true,
      },
    );
    return card;
  } catch (error: any) {
    throw error;
  }
};

export const setCardSpendingLimit = async (id: string, props: setSpendingLimitConfig) => {
  const { spending_limit, spending_limit_interval } = props;
  try {
    const spendLimit = await cardModel.findOne({ _id: id, status: CardStatus.ACTIVATED });

    if (spendLimit) {
      spendLimit.spending_limit = spending_limit;
      spendLimit.spending_limit_interval = spending_limit_interval;

      const limit = getSpendingLimitDuration(spending_limit_interval, spendLimit?.createdAt);

      spendLimit.spending_limit_date = limit;

      return await spendLimit.save();
    }
  } catch (error) {
    logger.error('Unable to set spending limit at this time', error);
    throw error;
  }
};

export const expireCardsWhenDue = async () => {
  try {
    const cards = await cardModel.find({ status: CardStatus.ACTIVATED, expiry_date: { $lte: new Date() } });

    cards.forEach(async (card) => {
      await cardModel.findOneAndUpdate(
        {
          _id: card?.id,
        },
        {
          status: CardStatus.EXPIRED,
        },
        {
          new: true,
        },
      );
    });
  } catch (error) {
    throw error;
  }
};

// cron job that checks if spending_limit_duration == today and reset the spending_limit and remaining_spend to same amount
export const resetSpendLimitAndRemainingSpendWhenDue = async () => {
  try {
    const cards = await cardModel.find({ status: CardStatus.ACTIVATED, spending_limit_date: { $lte: new Date() } });

    cards.forEach(async (card) => {
      await cardModel.findOneAndUpdate(
        {
          _id: card?.id,
        },
        {
          spending_limit: card.spending_limit,
          remaining_spend: card.spending_limit,
        },
        {
          new: true,
        },
      );
    });
  } catch (error) {
    throw error;
  }
};
