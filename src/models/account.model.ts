import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { mongooseSchemaConfig } from '../common/utils/database/schema.config';
import { Card } from './card.model';
import { Company } from './company.model';

export enum Currency {
  KR = 'Kr',
}

@modelOptions(mongooseSchemaConfig)
export class Account {
  @prop({ type: () => Number })
  balance: number;

  @prop({ type: () => String })
  account_number: string;

  @prop({ type: () => String, enum: Currency, default: Currency.KR })
  currency: Currency;

  @prop({ ref: () => Company, required: true })
  company: Ref<Company>;

  @prop({ ref: () => Card, required: true })
  card: Ref<Card>[];
}

const accountModel = getModelForClass(Account);

export default accountModel;

// endpoint for set limit, takes only spending_limit as arguement
// an endpoint to update spending_limit
// spending_limit_interval = today's date + week

// feb 11 created card
// 2023-02-11 - expiry date

// activate card
// status = activated
// expiry date - 2023-02-11 + 2

// expiry date - 2023-02-11 + 30 and status = pending
// then deactivate