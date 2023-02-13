import Joi from "joi";
import { objectId } from "./common/custom.validation";

const createTransactionValidation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    amount: Joi.number().required(),
    card: Joi.string().required(),
    account: Joi.string().required(),
  }),
};


export { createTransactionValidation };
