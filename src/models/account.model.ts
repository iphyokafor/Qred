import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { mongooseSchemaConfig } from '../common/utils/database/schema.config';
import { Card } from './card.model';
import { Company } from './company.model';

export enum Currency {
  KR = 'Kr',
}

@modelOptions(mongooseSchemaConfig)
export class Account {
  @prop({ type: () => Number, default: 0 })
  balance: number;

  @prop({ type: () => String })
  account_number: string;

  @prop({ type: () => String, enum: Currency, default: Currency.KR })
  currency: Currency;

  @prop({ ref: () => Company, required: true })
  company: Ref<Company>;

  @prop({
    ref: 'Card',
    foreignField: 'account',
    localField: '_id',
  })
  cards: Ref<Card>[];
}
