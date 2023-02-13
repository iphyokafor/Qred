const router = require('express').Router();

import companyRoute from './company.route';
import accountRoute from './account.route';
import cardRoute from './card.route';
import transactionRoute from './transaction.route';

router.use('/v1', companyRoute);
router.use('/v1', accountRoute);
router.use('/v1', cardRoute);
router.use('/v1', transactionRoute);

export default router;
