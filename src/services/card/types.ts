import { CardStatus, CardType, SpendingLimitInterval } from '../../models/card.model';

export type createCardConfig = {
  card_number: string;
  expiry_date: Date;
  cvv: number;
  pin: string;
  card_type: CardType;
  status: CardStatus;
  company: string;
};

export type setSpendingLimitConfig = {
  spending_limit: number;
  spending_limit_interval: SpendingLimitInterval;
};
