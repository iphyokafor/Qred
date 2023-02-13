import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Account } from './account.model';
import { Card } from './card.model';

export enum Type {
  DEBIT = 'debit',
  CREDIT = 'credit',
}

export enum Status {
  SUCCESS = 'success',
  PENDING = 'pending',
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Transaction {
  @prop({ type: () => String })
  narration: string;

  @prop({ type: () => Number, required: true })
  amount: number;

  @prop({ type: () => String, enum: Type, required: true })
  type: Type;

  @prop({ type: () => String, enum: Status, required: true })
  status: Status;

  @prop({ ref: () => Card })
  card: Ref<Card>;

  @prop({ ref: () => Account })
  account: Ref<Account>;
}

const transactionModel = getModelForClass(Transaction);

export default transactionModel;
