import Joi from "joi";
import { objectId } from "./common/custom.validation";

const createCompanyValidation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string().required(),
    year_founded: Joi.number().required(),
  }),
};

const updateCompanyValidation = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().optional(),
      address: Joi.string().optional(),
      year_founded: Joi.number().optional(),
    })
    .min(1),
};

export { createCompanyValidation, updateCompanyValidation };
