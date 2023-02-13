import Joi from "joi";
import { CardType, SpendingLimitInterval } from "../../models/card.model";

const createCardValidation = {
  body: Joi.object().keys({
    card_type: Joi.string().valid(...Object.values(CardType)),
    company: Joi.string().required(),
  }),
};

const createSetLimitValidation = {
  body: Joi.object().keys({
    spending_limit: Joi.number(),
    spending_limit_interval: Joi.string().valid(...Object.values(SpendingLimitInterval)),
  }),
};

export { createCardValidation, createSetLimitValidation };