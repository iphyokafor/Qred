import { fetchTransactionsHandler, transferFundHandler } from '../controllers/transaction.controller';

const router = require('express').Router();

router.post('/transaction/transfer/:id', transferFundHandler);
router.get('/transaction', fetchTransactionsHandler);

export default router;
