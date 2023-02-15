import {
  activateCardHandler,
  addCardHandler,
  createSpendingLimitHandler,
  fetchActivatedCardsHandler,
  fetchCardHandler,
  fetchPendingCardsHandler,
  updateCardPinHandler,
} from '../controllers/card.controller';
import validate from '../middlewares/validate';
import { createCardValidation, createSetLimitValidation } from './validations/card.validation';

const router = require('express').Router();

router.post('/card/add-card', validate(createCardValidation), addCardHandler);
router.post('/card/setlimit/:id', validate(createSetLimitValidation), createSpendingLimitHandler);
router.patch('/card/activate/:id', activateCardHandler);
router.get('/card/:id', fetchCardHandler);
router.patch('/card/pin/:id', updateCardPinHandler);
router.get('/card/active-cards/:companyId', fetchActivatedCardsHandler);
router.get('/card/pending-cards/:companyId', fetchPendingCardsHandler);

export default router;
