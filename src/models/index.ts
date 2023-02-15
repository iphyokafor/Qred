import { getModelForClass } from '@typegoose/typegoose';
import { Account } from './account.model';
import { Card } from './card.model';
import { Company } from './company.model';
import { Transaction } from './transaction.model';

const accountModel = getModelForClass(Account);
const cardModel = getModelForClass(Card);
const companyModel = getModelForClass(Company);
const transactionModel = getModelForClass(Transaction);

export { accountModel, cardModel, companyModel, transactionModel };
