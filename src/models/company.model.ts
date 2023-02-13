import { getModelForClass, index, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { mongooseSchemaConfig } from '../common/utils/database/schema.config';
import { Account } from './account.model';
import { Card } from './card.model';

export enum CompanyStatus {
  DEACTIVATE = 'deactivate',
  ACTIVE = 'active',
}

@modelOptions(mongooseSchemaConfig)
export class Company {
  @prop({ type: () => String, unique: true, required: true })
  name: string;

  @prop({ type: () => String, required: true })
  address: string;

  @prop({ type: () => Number, required: true })
  year_founded: number;

  @prop({ type: () => String, enum: CompanyStatus, default: CompanyStatus.ACTIVE })
  status: CompanyStatus;

  @prop({
    type: Date,
  })
  deletedAt: Date;

  @prop({
    ref: 'Account',
    foreignField: 'company',
    localField: '_id',
  })
  accounts: Ref<Account>[];

  @prop({
    ref: 'Card',
    foreignField: 'company',
    localField: '_id',
  })
  cards: Ref<Card>[];
}

const companyModel = getModelForClass(Company);

export default companyModel;
