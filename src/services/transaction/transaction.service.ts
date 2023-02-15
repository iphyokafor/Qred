import { MINIMUM_ACCOUNT_BALANCE } from '../../common/constant';
import { PageDtoConfig } from '../../common/interface';
import logger from '../../config/logger';
import { accountModel, transactionModel } from '../../models';
import  { Status, Transaction, Type } from '../../models/transaction.model';
import { transferFundConfig, updateConfig } from './types';

export const createTransaction = async (input: Partial<Transaction>) => {
  try {
    const transaction = await transactionModel.create({
      ...input,
    });

    return transaction;
  } catch (error) {
    logger.error('Unable to create transaction info at this time', error);
    throw error;
  }
};

export const getTransactionPaginatedAndSearch = async (props: PageDtoConfig) => {
  let { search, page, limit } = props;

  try {
    page = !page || isNaN(page) ? 1 : Number(page);

    const searchQueries = {
      $or: [{ type: { $regex: search, $options: 'ig' } }],
    };

    page = page < 1 ? 1 : Number(page);

    limit = !limit || isNaN(limit) ? 5 : Number(limit);

    let query = search ? searchQueries : {};

    const count = await transactionModel.countDocuments({ query, status: Status.SUCCESS });

    let totalPages = Math.ceil(count / limit);
    page = page > totalPages ? totalPages : page;

    const transactions = await transactionModel
      .find({ query, status: Status.SUCCESS })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    return {
      transactions,
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

export const transferFund = async (accountId: string, props: transferFundConfig) => {
  const { account_number, amount, narration } = props;
  try {
    const receiver = await accountModel.findOne({ account_number });

    if (!receiver) {
      throw new Error('Invalid account number');
    }

    const sender = await accountModel.findOne({ _id: accountId });

    if (!sender) {
      throw new Error('no account found');
    }

    if (sender.balance <= MINIMUM_ACCOUNT_BALANCE) {
      throw new Error('kindly fund your account');
    }

    if (amount > sender.balance) {
      throw new Error('insufficient balance');
    }

    const payload = {
      senderBalance: sender.balance,
      amount: amount,
      accountId: accountId,
      receiverBalnace: receiver.balance,
      account_number: account_number,
      narration: narration,
    } as updateConfig;

    const senderAccount = await updateSenderAndReceiverBalanceAndCreateTransaction(payload);

    return senderAccount;
  } catch (error) {
    logger.error('Unable to transfer fund at this time', error);
    throw error;
  }
};

async function updateSenderAndReceiverBalanceAndCreateTransaction(props: updateConfig) {
  const { senderBalance, amount, accountId, receiverBalnace, account_number, narration } = props;
  const newSenderBalance = Number(senderBalance) - Number(amount);

  const senderAccount = await accountModel.findByIdAndUpdate(
    {
      _id: accountId,
    },
    {
      balance: newSenderBalance,
    },
    {
      new: true,
    },
  );

  // save a copy of the sender transaction
  await createTransaction({
    amount: amount,
    type: Type.DEBIT,
    status: Status.SUCCESS,
    narration: narration,
  });

  const newReceiverBalance = Number(receiverBalnace) + Number(amount);
  await accountModel.findOneAndUpdate(
    {
      account_number,
    },
    {
      balance: newReceiverBalance,
    },
    {
      new: true,
    },
  );
  // save a copy of the receiver transaction
  await createTransaction({
    amount: amount,
    type: Type.CREDIT,
    status: Status.SUCCESS,
    narration: narration,
  });
  return senderAccount;
}
