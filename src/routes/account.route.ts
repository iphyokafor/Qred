import { addAccountHandler, fetchAccountHandler } from '../controllers/account.controller';

const router = require('express').Router();

router.get('/account/:id', fetchAccountHandler);
router.post('/account/add-account', addAccountHandler);

export default router;
