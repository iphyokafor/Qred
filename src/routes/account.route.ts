import { fetchAccountHandler } from '../controllers/account.controller';

const router = require('express').Router();

router.get('/account/:id', fetchAccountHandler);

export default router;
