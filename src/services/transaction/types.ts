import { Status, Type } from '../../models/transaction.model';

export type createTransactionConfig = {
  narration: string;
  amount: number;
  type: Type;
  status: Status;
  account: string;
  card: string;
};

export type transferFundConfig = {
  account_number: string;
  amount: number;
  narration: string;
};

export type updateConfig = {
  senderBalance: number;
  amount: number;
  accountId: string;
  receiverBalnace: number;
  account_number: string;
  narration: string;
};
