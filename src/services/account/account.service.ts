import logger from '../../config/logger';
import accountModel, { Account } from '../../models/account.model';
export const createAccount = async (input: Partial<Account>) => {
  try {
    const account = await accountModel.create({
      ...input,
    });

    return account;
  } catch (error) {
    logger.error('Unable to create account info at this time', error);
    throw error;
  }
};
export const getAccount = async (id: string) => {
  try {
    const account = await accountModel.findOne({ _id: id }).populate('company card');

    return account;
  } catch (error) {
    logger.error('Failed to get account', error);
    throw error;
  }
};
