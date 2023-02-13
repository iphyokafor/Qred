import { getModelForClass, modelOptions, pre, prop, Ref } from '@typegoose/typegoose';
import { mongooseSchemaConfig } from '../common/utils/database/schema.config';
import { Company } from './company.model';

export enum CardType {
  MASTER = 'master',
  VISA = 'visa',
}

export enum CardStatus {
  PENDING = 'pending',
  ACTIVATED = 'activate',
  DEACTIVATED = 'deactivate',
  EXPIRED = 'expired',
}

export enum SpendingLimitInterval {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

@modelOptions(mongooseSchemaConfig)
export class Card {
  @prop({ type: () => String, unique: true, required: true })
  card_number: string;

  @prop({ type: () => Date, required: true })
  expiry_date: Date;

  @prop({ type: () => Number, required: true })
  cvv: number;

  @prop({ type: () => String, required: true })
  pin: string;

  @prop({ type: () => String, enum: CardType, required: true })
  card_type: CardType;

  @prop({ type: () => String, enum: CardStatus, required: true, default: CardStatus.PENDING })
  status: CardStatus;

  @prop({ type: () => Number, default: 0 })
  remaining_spend: number; 

  @prop({ type: () => Number, default: 0 })
  spending_limit: number; 

  @prop({ type: () => String, enum: SpendingLimitInterval })
  spending_limit_interval: SpendingLimitInterval;

  @prop({ type: () => Date })
  spending_limit_date: Date;

  @prop({ ref: () => Company })
  company: Ref<Company>;
}

const cardModel = getModelForClass(Card);

export default cardModel;
