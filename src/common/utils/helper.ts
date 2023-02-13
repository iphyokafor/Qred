import { addYears } from 'date-fns';
import { NUMBER_OF_EXPIRY_YEAR, SET_LIMIT_EXPIRATION } from '../constant';
import bcrypt from 'bcrypt';
import { addDays } from 'date-fns';
import { SpendingLimitInterval } from '../../models/card.model';

const randomstring = require('randomstring');

export const randomInterger = (length: number): number => {
  return randomstring.generate({
    length,
    charset: 'numeric',
  });
};

export const genarateAccountNumber = () => {
  const prefix = '07';
  return `${prefix}${randomInterger(8)}`;
};

export const genarateMasterCardNumber = () => {
  const prefix = '5399';
  return `${prefix}${randomInterger(12)}`;
};

export const genarateVisaCardNumber = () => {
  const prefix = '4165';
  return `${prefix}${randomInterger(12)}`;
};

export const genarateCardCvv = () => {
  return randomInterger(3);
};

export const getTodaysDate = (date: Date) => {
  const newDate = new Date(date);
  return newDate.toISOString().split('T')[0]; // 2022-01-31
};

export const calculateExpiryYear = (date: Date) => {
  const todayeDate = new Date(date);
  const result = addYears(new Date(todayeDate), NUMBER_OF_EXPIRY_YEAR);
  return result;
};

export const hashPin = async (pin: string) => {
  const hashPin = await bcrypt.hash(pin, bcrypt.genSaltSync(10));
  return hashPin;
};

export const getSpendingLimitDuration = (spendLimit: SpendingLimitInterval, createdAt: Date) => {
  let endDate = addDays(new Date(createdAt), SET_LIMIT_EXPIRATION.DAILY_LIMIT);

  if (spendLimit === SpendingLimitInterval.WEEKLY) {
    endDate = addDays(new Date(createdAt), SET_LIMIT_EXPIRATION.WEEKLY_LIMIT);
  }

  if (spendLimit === SpendingLimitInterval.MONTHLY) {
    endDate = addDays(new Date(createdAt), SET_LIMIT_EXPIRATION.MONTHLY_LIMIT);
  }

  return endDate;
}